import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";

/** サーバーで実行時の環境変数から組み立て、クライアントに渡す Firebase の設定 */
export type FirebaseClientConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
};

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
};

let client: FirebaseClient | undefined;

/** 渡された設定で Firebase を一度だけ初期化する（クライアント専用） */
export function getFirebaseClient(
  config: FirebaseClientConfig,
): FirebaseClient {
  if (client) return client;

  const app = getApps().length === 0 ? initializeApp(config) : getApp();
  client = { app, auth: getAuth(app) };
  return client;
}
