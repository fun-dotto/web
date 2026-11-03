import type { DescService } from "@bufbuild/protobuf";
import {
  type Client,
  createClient,
  type Interceptor,
} from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-node";

/**
 * Firebase のトークンを Cookie から読み出し、App API へのリクエストに付与する。
 */
const firebaseInterceptor: Interceptor = (next) => async (req) => {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const appCheckToken = cookieStore.get("firebase-app-check-token")?.value;
  if (appCheckToken) {
    req.header.set("X-Firebase-AppCheck", appCheckToken);
  }
  const idToken = cookieStore.get("firebase-id-token")?.value;
  if (idToken) {
    req.header.set("Authorization", `Bearer ${idToken}`);
  }
  return next(req);
};

let transport: ReturnType<typeof createConnectTransport> | undefined;

function getTransport() {
  if (!transport) {
    const baseUrl = process.env.API_BASE_URL;
    if (!baseUrl) {
      throw new Error("API_BASE_URL が設定されていません");
    }
    transport = createConnectTransport({
      baseUrl,
      httpVersion: "1.1",
      interceptors: [firebaseInterceptor],
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
