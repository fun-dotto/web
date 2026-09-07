import Link from "next/link";
import type { Metadata } from "next";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getMacPages } from "@/lib/notion";
import { ListItem } from "@/components/dotto/list-item";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mac サポート",
  description: "Mac サポートページ一覧",
};

function getTitle(page: PageObjectResponse): string {
  const prop = page.properties["ページ"];
  if (prop?.type === "title") {
    return prop.title.map((t) => t.plain_text).join("") || "無題";
  }
  return "無題";
}

function getTags(page: PageObjectResponse): string[] {
  const prop = page.properties["タグ"];
  if (prop?.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

function getDateStart(page: PageObjectResponse, name: string): Date | null {
  const prop = page.properties[name];
  if (prop?.type === "date" && prop.date?.start) {
    return new Date(prop.date.start);
  }
  return null;
}

function isPublished(page: PageObjectResponse, now: Date): boolean {
  const start = getDateStart(page, "公開開始日時");
  const end = getDateStart(page, "公開終了日時");
  if (!start || start > now) return false;
  if (end && end <= now) return false;
  return true;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function MacPage() {
  const allPages = await getMacPages();
  const filtered =
    process.env.NODE_ENV === "development"
      ? allPages
      : allPages.filter((p) => isPublished(p, new Date()));
  const pages = [...filtered].sort((a, b) => {
    const aStart = getDateStart(a, "公開開始日時")?.getTime() ?? 0;
    const bStart = getDateStart(b, "公開開始日時")?.getTime() ?? 0;
    return bStart - aStart;
  });

  return (
    <div>
      {/* Article List */}
      {pages.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">ページがありません</p>
        </div>
      ) : (
        <ul className="max-w-3xl mx-auto">
          {pages.map((page) => {
            const title = getTitle(page);
            const tags = getTags(page);
            const createdAtDate = getDateStart(page, "公開開始日時");
            const createdAt = createdAtDate ? formatDate(createdAtDate) : "";
            const lastEditedProp = page.properties["最終更新日時"];
            const lastEditedDate =
              lastEditedProp?.type === "last_edited_time"
                ? new Date(lastEditedProp.last_edited_time)
                : null;
            const lastEdited =
              lastEditedDate &&
              (!createdAtDate || lastEditedDate >= createdAtDate)
                ? formatDate(lastEditedDate)
                : "";
            const pageId = page.id.replace(/-/g, "");
            const value = lastEdited
              ? `${lastEdited} 更新`
              : createdAt
                ? `${createdAt} 作成`
                : undefined;

            return (
              <li key={page.id}>
                <Link href={`/mac/${pageId}`} className="block">
                  <ListItem
                    title={title}
                    description1={tags.length > 0 ? tags.join("、") : undefined}
                    value={value}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
