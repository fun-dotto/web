"use client";

import {
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { type FirebaseClientConfig, getFirebaseClient } from "@/lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

async function getAppCheckToken(
  config: FirebaseClientConfig,
): Promise<string | undefined> {
  const { appCheck } = getFirebaseClient(config);
  if (!appCheck) return undefined;
  const { getToken } = await import("firebase/app-check");
  try {
    const { token } = await getToken(appCheck, false);
    return token;
  } catch {
    return undefined;
  }
}

async function syncSessionCookie(
  user: User | null,
  config: FirebaseClientConfig,
) {
  if (user) {
    const [idToken, appCheckToken] = await Promise.all([
      user.getIdToken(),
      getAppCheckToken(config),
    ]);
    await fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken, appCheckToken }),
    });
  } else {
    await fetch("/api/auth/session", { method: "DELETE" });
  }
}

export function AuthProvider({
  firebaseConfig,
  children,
}: {
  firebaseConfig: FirebaseClientConfig;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { auth } = getFirebaseClient(firebaseConfig);
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      await syncSessionCookie(user, firebaseConfig);
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, [firebaseConfig]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getFirebaseClient(firebaseConfig).auth, provider);
  };

  const signOutUser = async () => {
    await signOut(getFirebaseClient(firebaseConfig).auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signOutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
