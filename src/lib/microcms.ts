import "server-only";
import sanitizeHtml from "sanitize-html";

/** 一覧・詳細ページの ISR の再検証間隔（秒）。 */
export const ARTICLES_REVALIDATE_SECONDS = 300;

/** On-demand Revalidation で使うキャッシュタグ。 */
export const ARTICLES_CACHE_TAG = "articles";

const LIST_LIMIT = 100;
const REQUEST_TIMEOUT_MS = 10_000;

export type ArticleSummary = {
  id: string;
  title: string;
  publishedAt: string;
};

export type Article = ArticleSummary & {
  body: string;
};

type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export class MicroCMSNotFoundError extends Error {}

function getConfig(): { serviceDomain: string; apiKey: string } {
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  const apiKey = process.env.MICROCMS_API_KEY;
  if (!serviceDomain || !apiKey) {
    throw new Error(
      "MICROCMS_SERVICE_DOMAIN and MICROCMS_API_KEY must be set.",
    );
  }
  return { serviceDomain, apiKey };
}

async function request<T>(
  path: string,
  params: Record<string, string>,
  { preview = false }: { preview?: boolean } = {},
): Promise<T> {
  const { serviceDomain, apiKey } = getConfig();
  const url = new URL(`https://${serviceDomain}.microcms.io/api/v1/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const res = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": apiKey },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    // 下書きのプレビューはキャッシュしない。
    ...(preview
      ? { cache: "no-store" as const }
      : {
          next: {
            revalidate: ARTICLES_REVALIDATE_SECONDS,
            tags: [ARTICLES_CACHE_TAG],
          },
        }),
  });
  if (res.status === 404) {
    throw new MicroCMSNotFoundError(`microCMS: ${path} not found`);
  }
  if (!res.ok) {
    throw new Error(`microCMS: GET ${path} failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

/** 公開中の記事を公開日時の新しい順に全件返す。 */
export async function listArticles(): Promise<ArticleSummary[]> {
  const articles: ArticleSummary[] = [];
  for (let offset = 0; ; offset += LIST_LIMIT) {
    const page = await request<ListResponse<ArticleSummary>>("articles", {
      fields: "id,title,publishedAt",
      orders: "-publishedAt,id",
      limit: String(LIST_LIMIT),
      offset: String(offset),
    });
    articles.push(...page.contents);
    if (page.contents.length === 0 || articles.length >= page.totalCount) {
      return articles;
    }
  }
}

/** 記事 ID はパスに埋め込むため、microCMS のコンテンツ ID として妥当な文字だけを許す。 */
function isValidArticleId(id: string): boolean {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

/**
 * 記事を取得する。存在しない場合は MicroCMSNotFoundError を投げる。
 * draftKey を渡すと公開前の記事をプレビューできる。
 */
export async function getArticle(
  id: string,
  draftKey?: string,
): Promise<Article> {
  if (!isValidArticleId(id)) {
    throw new MicroCMSNotFoundError(`microCMS: invalid article id`);
  }
  const params: Record<string, string> = {
    fields: "id,title,body,publishedAt",
  };
  if (draftKey) params.draftKey = draftKey;
  return request<Article>(`articles/${id}`, params, { preview: !!draftKey });
}

/** リッチエディタの HTML から危険な要素・属性を取り除く。 */
export function sanitizeArticleBody(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      "img",
      "figure",
      "figcaption",
      "iframe",
      "s",
      "u",
    ],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["id", "style"],
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      iframe: ["src", "width", "height", "allow", "allowfullscreen", "title"],
      td: ["colspan", "rowspan"],
      th: ["colspan", "rowspan"],
    },
    allowedStyles: {
      "*": {
        "text-align": [/^(left|right|center|justify)$/],
      },
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"], iframe: ["https"] },
    allowedIframeHostnames: [
      "www.youtube.com",
      "www.youtube-nocookie.com",
      "player.vimeo.com",
    ],
    transformTags: {
      a: (tagName, attribs) => {
        const isExternal = /^https?:\/\//.test(attribs.href ?? "");
        return {
          tagName,
          attribs: isExternal
            ? { ...attribs, target: "_blank", rel: "noopener noreferrer" }
            : attribs,
        };
      },
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

/** 公開日時を「2026年11月17日」の形式で表示する。 */
export function formatPublishedAt(publishedAt: string): string {
  return new Date(publishedAt).toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
