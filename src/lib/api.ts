import type { DescService } from "@bufbuild/protobuf";
import {
  type Client,
  createClient,
  type Interceptor,
} from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";
import { getServiceIdToken } from "@/lib/service-id-token";

/**
 * Web のサービスアカウントの Google ID トークンを付与する。
 * App API はこれで呼び出し元を確かめ、App Check の検証を省略する。
 * Authorization はユーザーの Firebase ID トークンに使うため、X-Service-Authorization に入れる。
 */
const serviceAuthInterceptor =
  (audience: string): Interceptor =>
  (next) =>
  async (req) => {
    req.header.set(
      "X-Service-Authorization",
      await getServiceIdToken(audience),
    );
    return next(req);
  };

/**
 * ユーザーの Firebase ID トークンを Cookie から読み出し、App API へのリクエストに付与する。
 */
const firebaseInterceptor: Interceptor = (next) => async (req) => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const idToken = cookieStore.get("firebase-id-token")?.value;
  if (idToken) {
    req.header.set("Authorization", `Bearer ${idToken}`);
  }
  return next(req);
};

let transport: ReturnType<typeof createConnectTransport> | undefined;

function getTransport() {
  if (!transport) {
    const baseUrl = process.env.APP_API_URL;
    if (!baseUrl) {
      throw new Error("APP_API_URL が設定されていません");
    }
    transport = createConnectTransport({
      baseUrl,
      httpVersion: "1.1",
      interceptors: [serviceAuthInterceptor(baseUrl), firebaseInterceptor],
    });
  }
  return transport;
}

/**
 * App API のクライアントを返す。サーバー側でのみ利用する。
 */
export function apiClient<T extends DescService>(service: T): Client<T> {
  return createClient(service, getTransport());
}
