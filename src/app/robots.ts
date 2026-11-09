import type { MetadataRoute } from "next";
import { getDottoEnv, getSiteUrl } from "@/lib/env";

// 実行時の DOTTO_ENV で返す内容を切り替えるため、ビルド時に静的生成しない。
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  // prd 以外(dev / stg)は検索エンジンにインデックスさせない。
  if (getDottoEnv() !== "prd") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // ログインが必要なページと API はクロール対象外にする。
      disallow: ["/api/", "/login", "/course", "/setting", "/mac"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
