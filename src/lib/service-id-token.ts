import { GoogleAuth, type IdTokenClient } from "google-auth-library";

/**
 * Web のサービスアカウントの Google ID トークンを取得する。
 * App API はこのトークンで呼び出し元が Web であることを確かめる。
 *
 * Cloud Run ではメタデータサーバーから取得する。ローカル開発では Application Default Credentials を使うため、
 * `gcloud auth application-default login --impersonate-service-account=web-dev@swift2023groupc.iam.gserviceaccount.com`
 * でサービスアカウントの権限を借りておく。
 * トークンのキャッシュと期限切れ前の更新は IdTokenClient が行う。
 */

const auth = new GoogleAuth();
const clients = new Map<string, Promise<IdTokenClient>>();

export async function getServiceIdToken(audience: string): Promise<string> {
  let client = clients.get(audience);
  if (!client) {
    client = auth.getIdTokenClient(audience);
    clients.set(audience, client);
  }
  const headers = await (await client).getRequestHeaders();
  const authorization = headers.get("Authorization");
  if (!authorization) {
    throw new Error("Google ID トークンを取得できませんでした");
  }
  return authorization;
}
