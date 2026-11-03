/**
 * Cloud Run のメタデータサーバーから、本サービスのサービスアカウントの Google ID トークンを取得する。
 * App API はこのトークンで呼び出し元が Web であることを確かめ、App Check の検証を省略する。
 */

const METADATA_IDENTITY_URL =
  "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity";

// ID トークンの有効期限は 1 時間。余裕を持って 50 分で取り直す。
const TOKEN_TTL_MS = 50 * 60 * 1000;
const FETCH_TIMEOUT_MS = 2000;

const cache = new Map<string, { token: string; expiresAt: number }>();

/**
 * audience 向けの ID トークンを返す。メタデータサーバーがない環境（ローカル開発など）では undefined を返す。
 */
export async function getServiceIdToken(
  audience: string,
): Promise<string | undefined> {
  const cached = cache.get(audience);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }

  try {
    const url = `${METADATA_IDENTITY_URL}?audience=${encodeURIComponent(audience)}`;
    const res = await fetch(url, {
      headers: { "Metadata-Flavor": "Google" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      cache: "no-store",
    });
    if (!res.ok) {
      console.warn(`ID トークンの取得に失敗しました: ${res.status}`);
      return undefined;
    }
    const token = (await res.text()).trim();
    cache.set(audience, { token, expiresAt: Date.now() + TOKEN_TTL_MS });
    return token;
  } catch {
    return undefined;
  }
}
