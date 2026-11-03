import type { FirebaseClientConfig } from "@/lib/firebase";

export type DottoEnv = "dev" | "stg" | "prd";

const dottoEnvs: readonly DottoEnv[] = ["dev", "stg", "prd"];

/**
 * 実行時の環境変数 DOTTO_ENV から環境を判定する。
 * イメージを全環境で共通にするため、ビルド時ではなくリクエスト時に読む。
 */
export function getDottoEnv(): DottoEnv {
  const value = process.env.DOTTO_ENV ?? "dev";
  if (!dottoEnvs.includes(value as DottoEnv)) {
    throw new Error(
      `Invalid DOTTO_ENV "${value}". Expected one of: ${dottoEnvs.join(", ")}.`,
    );
  }
  return value as DottoEnv;
}

/**
 * クライアントに渡す Firebase の設定を実行時の環境変数から組み立てる。
 * NEXT_PUBLIC_* はビルド時に埋め込まれるため使わない。
 */
export function getFirebaseClientConfig(): FirebaseClientConfig {
  return {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };
}

export function getFirebaseMeasurementId(): string | undefined {
  return process.env.FIREBASE_MEASUREMENT_ID || undefined;
}
