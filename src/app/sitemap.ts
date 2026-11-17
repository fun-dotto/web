import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/env";
import { listArticles } from "@/lib/microcms";

// 実行時の DOTTO_ENV で URL を切り替えるため、ビルド時に静的生成しない。
export const dynamic = "force-dynamic";

// 未ログインで閲覧できるページのみを載せる。
const publicPaths = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.3 },
  { path: "/articles", changeFrequency: "weekly", priority: 0.5 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const staticEntries: MetadataRoute.Sitemap = publicPaths.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${siteUrl}${path === "/" ? "" : path}`,
      changeFrequency,
      priority,
    }),
  );

  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    articleEntries = (await listArticles()).map((article) => ({
      url: `${siteUrl}/articles/${article.id}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly",
      priority: 0.4,
    }));
  } catch (error) {
    // microCMS の障害でサイトマップ全体を落とさない。
    console.error(error);
  }

  return [...staticEntries, ...articleEntries];
}
