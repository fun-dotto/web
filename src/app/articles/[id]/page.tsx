import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeaderTitle } from "@/contexts/page-header-context";
import { getSiteUrl } from "@/lib/env";
import {
  type Article,
  formatPublishedAt,
  getArticle,
  MicroCMSNotFoundError,
  sanitizeArticleBody,
} from "@/lib/microcms";

export const revalidate = 300;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ draftKey?: string | string[] }>;
};

async function loadArticle(
  id: string,
  draftKey: string | string[] | undefined,
): Promise<Article> {
  try {
    return await getArticle(
      id,
      typeof draftKey === "string" ? draftKey : undefined,
    );
  } catch (error) {
    if (error instanceof MicroCMSNotFoundError) notFound();
    throw error;
  }
}

function toDescription(html: string): string {
  const text = sanitizeArticleBody(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 120 ? `${text.slice(0, 120)}…` : text;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const { draftKey } = await searchParams;
  const article = await loadArticle(id, draftKey);
  const description = toDescription(article.body);
  const url = `${getSiteUrl()}/articles/${article.id}`;
  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      publishedTime: article.publishedAt,
    },
    // 下書きのプレビューは検索エンジンに載せない。
    robots: draftKey ? { index: false, follow: false } : undefined,
  };
}

export default async function ArticlePage({ params, searchParams }: Props) {
  const { id } = await params;
  const { draftKey } = await searchParams;
  const article = await loadArticle(id, draftKey);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <PageHeaderTitle title={article.title} />
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-label-primary">
          {article.title}
        </h1>
        {article.publishedAt && (
          <time
            dateTime={article.publishedAt}
            className="mt-2 block text-xs text-label-secondary tabular-nums"
          >
            {formatPublishedAt(article.publishedAt)}
          </time>
        )}
      </header>
      <div
        className="article-body"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitizeArticleBody でサニタイズ済み
        dangerouslySetInnerHTML={{ __html: sanitizeArticleBody(article.body) }}
      />
    </article>
  );
}
