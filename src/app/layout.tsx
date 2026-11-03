import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { connection } from "next/server";
import { AuthGuard } from "@/components/auth/auth-guard";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import { getFirebaseClientConfig, getFirebaseMeasurementId } from "@/lib/env";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Dotto - 公立はこだて未来大学ポータルアプリ",
    template: "%s - Dotto",
  },
  description:
    "Dottoは2023年12月から運用されている、公立はこだて未来大学のポータルアプリです。",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 環境ごとの設定を実行時の環境変数から読むため、ビルド時に静的生成しない。
  await connection();
  const firebaseConfig = getFirebaseClientConfig();
  const measurementId = getFirebaseMeasurementId();

  return (
    <html lang="ja" className={`${notoSansJP.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <TooltipProvider>
          <AuthProvider firebaseConfig={firebaseConfig}>
            <AuthGuard>{children}</AuthGuard>
          </AuthProvider>
        </TooltipProvider>
        <ServiceWorkerRegistration />
        {measurementId && <GoogleAnalytics gaId={measurementId} />}
      </body>
    </html>
  );
}
