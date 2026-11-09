import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";

// 実行時の DOTTO_ENV で URL を切り替えるため、ビルド時に静的生成しない。
export const dynamic = "force-dynamic";

// 未ログインで閲覧できるページのみを載せる。
const publicPaths = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  return publicPaths.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path === "/" ? "" : path}`,
    changeFrequency,
    priority,
  }));
}
