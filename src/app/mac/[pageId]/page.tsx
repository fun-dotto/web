import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getPage, getPageBlocks } from "@/lib/notion";
import { blocksToMarkdown } from "@/lib/notion-markdown";
import { NotionRenderer } from "@/components/notion/NotionRenderer";
import { CopyMarkdownButton } from "@/components/notion/CopyMarkdownButton";
import {
  PageHeaderActions,
  PageHeaderTitle,
} from "@/contexts/page-header-context";

export const dynamic = "force-dynamic";

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

function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getCreatedAtDate(page: PageObjectResponse): Date | null {
  const prop = page.properties["公開開始日時"];
  if (prop?.type === "date" && prop.date?.start) {
    return new Date(prop.date.start);
  }
  return null;
}

function getLastEditedDate(page: PageObjectResponse): Date | null {
  const prop = page.properties["最終更新日時"];
  if (prop?.type === "last_edited_time") {
    return new Date(prop.last_edited_time);
  }
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pageId: string }>;
}): Promise<Metadata> {
  try {
    const { pageId } = await params;
    const page = await getPage(pageId);
    return { title: getTitle(page) };
  } catch {
    return { title: "Mac サポート" };
  }
}

export default async function MacDetailPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;

  let page: PageObjectResponse;
  try {
    page = await getPage(pageId);
  } catch {
    notFound();
  }

  const blocks = await getPageBlocks(pageId);
  const title = getTitle(page);
  const tags = getTags(page);
  const createdAtDate = getCreatedAtDate(page);
  const lastEditedDate = getLastEditedDate(page);
  const createdAt = createdAtDate ? formatDate(createdAtDate) : "";
  const lastEdited =
    lastEditedDate && (!createdAtDate || lastEditedDate >= createdAtDate)
      ? formatDate(lastEditedDate)
      : "";

  return (
    <div className="flex justify-center">
      <div className="flex-1 max-w-3xl">
        <PageHeaderTitle title={title} />
        <PageHeaderActions>
          <CopyMarkdownButton markdown={blocksToMarkdown(title, blocks)} />
        </PageHeaderActions>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-0.5 rounded-full border border-label-secondary/20 text-label-secondary"
            >
              {tag}
            </span>
          ))}
          {createdAt && (
            <span className="text-xs text-label-secondary/60 tabular-nums">
              {createdAt} 作成
            </span>
          )}
          {lastEdited && (
            <span className="text-xs text-label-secondary/60 tabular-nums">
              {lastEdited} 更新
            </span>
          )}
        </div>

        {/* Content */}
        <div>
          {blocks.length === 0 ? (
            <p className="text-center text-label-secondary text-sm py-8">
              コンテンツがありません
            </p>
          ) : (
            <NotionRenderer blocks={blocks} />
          )}
        </div>
      </div>
    </div>
  );
}
