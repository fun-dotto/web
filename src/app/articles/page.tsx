import { ChevronRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ListItem } from "@/components/dotto/list-item";
import {
  type ArticleSummary,
  formatPublishedAt,
  listArticles,
} from "@/lib/microcms";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "Dotto からのお知らせ一覧",
};

// ARTICLES_REVALIDATE_SECONDS と揃える（静的解析されるためリテラルで書く）。
export const revalidate = 300;

export default async function Page() {
  let articles: ArticleSummary[] | undefined;
  try {
    articles = await listArticles();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {!articles ? (
        <div className="py-20 text-center">
          <p className="text-accent-error text-sm">
            お知らせの取得に失敗しました。
          </p>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">お知らせはありません</p>
        </div>
      ) : (
        <ul>
          {articles.map((article) => (
            <li key={article.id}>
              <Link href={`/articles/${article.id}`} className="block">
                <ListItem
                  title={article.title}
                  description1={formatPublishedAt(article.publishedAt)}
                  trailingIcon={ChevronRightIcon}
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
