import { timestampDate } from "@bufbuild/protobuf/wkt";
import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import {
  type Announcement,
  AnnouncementService,
} from "@/api/app/v1/announcement_pb";
import { ListItem } from "@/components/dotto/list-item";
import { apiClient } from "@/lib/api";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "大学からのお知らせ一覧",
};

export const dynamic = "force-dynamic";

function formatDate(d: Date): { year: string; month: string; day: string } {
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

function relativeLabel(d: Date, now: Date): string | null {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(d, now)) return "今日";
  if (isSameDay(d, yesterday)) return "昨日";
  const diffDays = Math.floor(
    (today.getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      86400000,
  );
  if (diffDays > 0 && diffDays < 7) return `${diffDays}日前`;
  return null;
}

export default async function Page() {
  let announcements: Announcement[] | undefined;
  try {
    ({ announcements } = await apiClient(AnnouncementService).listAnnouncements(
      {},
    ));
  } catch (error) {
    console.error(error);
  }

  return (
    <div>
      {!announcements ? (
        <div className="py-20 text-center">
          <p className="text-accent-error text-sm">
            お知らせの取得に失敗しました。
          </p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">お知らせはありません</p>
        </div>
      ) : (
        <ul className="max-w-3xl mx-auto">
          {announcements.map((announcement) => {
            const date = announcement.availableFrom
              ? timestampDate(announcement.availableFrom)
              : new Date(0);
            const { year, month, day } = formatDate(date);
            const relative = relativeLabel(date, new Date());

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
