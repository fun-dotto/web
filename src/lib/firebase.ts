import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import {
  type AppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from "firebase/app-check";
import { type Auth, getAuth } from "firebase/auth";

/** サーバーで実行時の環境変数から組み立て、クライアントに渡す Firebase の設定 */
export type FirebaseClientConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  appCheckSiteKey?: string;
  appCheckDebugToken?: string;
};

type FirebaseClient = {
  app: FirebaseApp;
  auth: Auth;
  appCheck: AppCheck | undefined;
};

let client: FirebaseClient | undefined;

const initializeClientAppCheck = (
  app: FirebaseApp,
  config: FirebaseClientConfig,
): AppCheck | undefined => {
  if (typeof window === "undefined" || !config.appCheckSiteKey) {
    return undefined;
  }

  const appCheckGlobal = globalThis as typeof globalThis & {
    __FIREBASE_APP_CHECK__?: AppCheck;
    FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean;
  };

  if (appCheckGlobal.__FIREBASE_APP_CHECK__) {
    return appCheckGlobal.__FIREBASE_APP_CHECK__;
  }

  if (config.appCheckDebugToken) {
    appCheckGlobal.FIREBASE_APPCHECK_DEBUG_TOKEN =
      config.appCheckDebugToken === "true" ? true : config.appCheckDebugToken;
  }

  try {
    const instance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.appCheckSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
    appCheckGlobal.__FIREBASE_APP_CHECK__ = instance;
    return instance;
  } catch {
    return undefined;
  }
};

/** 渡された設定で Firebase を一度だけ初期化する（クライアント専用） */
export function getFirebaseClient(
  config: FirebaseClientConfig,
): FirebaseClient {
  if (client) return client;

  const { appCheckSiteKey, appCheckDebugToken, ...options } = config;
  const app = getApps().length === 0 ? initializeApp(options) : getApp();
  client = {
    app,
    auth: getAuth(app),
    appCheck: initializeClientAppCheck(app, {
      appCheckSiteKey,
      appCheckDebugToken,
    }),
  };
  return client;
}
