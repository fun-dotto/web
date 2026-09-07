import type { Metadata } from "next";
import { ExternalLinkIcon } from "lucide-react";
import { api } from "@/lib/api";
import { ListItem } from "@/components/dotto/list-item";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "大学からのお知らせ一覧",
};

export const dynamic = "force-dynamic";

function formatDate(iso: string): { year: string; month: string; day: string } {
  const d = new Date(iso);
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function relativeLabel(iso: string, now: Date): string | null {
  const d = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, now)) return "今日";
  if (isSameDay(d, yesterday)) return "昨日";
  const diffDays = Math.floor(
    (today.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      86400000,
  );
  if (diffDays > 0 && diffDays < 7) return `${diffDays}日前`;
  return null;
}

export default async function Page() {
  const { data, error } = await api.GET("/v1/announcements");

  return (
    <div>
      {error || !data ? (
        <div className="py-20 text-center">
          <p className="text-accent-error text-sm">
            お知らせの取得に失敗しました。
          </p>
        </div>
      ) : data.announcements.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">お知らせはありません</p>
        </div>
      ) : (
        <ul className="max-w-3xl mx-auto">
          {data.announcements.map((announcement) => {
            const { year, month, day } = formatDate(announcement.date);
            const relative = relativeLabel(announcement.date, new Date());

            return (
              <li key={announcement.id}>
                <a
                  href={announcement.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <ListItem
                    title={announcement.title}
                    description1={`${year}/${month}/${day}`}
                    description2={relative ?? undefined}
                    trailingIcon={ExternalLinkIcon}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
