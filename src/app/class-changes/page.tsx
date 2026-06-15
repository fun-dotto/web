import type { Metadata } from "next";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "休講・補講・教室変更",
  description: "休講・補講・教室変更情報の一覧",
};

// 「今日」を基準にフィルタするため、ビルド時の静的化を避けてリクエストごとに描画する
export const dynamic = "force-dynamic";

type LectureInfoType = "Cancelled" | "Makeup" | "RoomChanged";

type LectureInfoItem = {
  id: string;
  type: LectureInfoType;
  date: string;
  period: string;
  subjectName: string;
  detail: string;
};

function formatDate(iso: string): { year: string; month: string; day: string } {
  const d = new Date(`${iso}T00:00:00`);
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0"),
    day: String(d.getDate()).padStart(2, "0"),
  };
}

function periodLabel(period: string): string {
  return period.replace("Period", "") + "限";
}

function typeLabel(type: LectureInfoType): string {
  if (type === "Cancelled") return "休講";
  if (type === "Makeup") return "補講";
  return "教室変更";
}

function typeBadgeClass(type: LectureInfoType): string {
  if (type === "Cancelled") {
    return "border-accent-error/30 text-accent-error bg-accent-error/5";
  }
  if (type === "Makeup") {
    return "border-accent-info/30 text-accent-info bg-accent-info/5";
  }
  return "border-border-primary text-label-secondary bg-background-secondary";
}

function isTodayOrLater(iso: string, today: number): boolean {
  return new Date(`${iso}T00:00:00`).getTime() >= today;
}

function sortByDateAsc(a: LectureInfoItem, b: LectureInfoItem): number {
  const aTime = new Date(`${a.date}T00:00:00`).getTime();
  const bTime = new Date(`${b.date}T00:00:00`).getTime();
  return aTime - bTime;
}

function sectionLabel(type: LectureInfoType): string {
  return typeLabel(type);
}

function sectionId(type: LectureInfoType): string {
  if (type === "Cancelled") return "cancelled";
  if (type === "Makeup") return "makeup";
  return "room-changed";
}

export default async function Page() {
  const [cancelledRes, makeupRes, roomChangeRes] = await Promise.all([
    api.GET("/v1/cancelledClasses"),
    api.GET("/v1/makeupClasses"),
    api.GET("/v1/roomChanges"),
  ]);

  const hasError = !!(
    cancelledRes.error ||
    makeupRes.error ||
    roomChangeRes.error ||
    !cancelledRes.data ||
    !makeupRes.data ||
    !roomChangeRes.data
  );

  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();

  const cancelledItems: LectureInfoItem[] = hasError
    ? []
    : cancelledRes.data.cancelledClasses
        .map((item) => ({
          id: item.id,
          type: "Cancelled" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: item.comment,
        }))
        .filter((item) => isTodayOrLater(item.date, todayStart))
        .sort(sortByDateAsc);

  const makeupItems: LectureInfoItem[] = hasError
    ? []
    : makeupRes.data.makeupClasses
        .map((item) => ({
          id: item.id,
          type: "Makeup" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: item.comment,
        }))
        .filter((item) => isTodayOrLater(item.date, todayStart))
        .sort(sortByDateAsc);

  const roomChangedItems: LectureInfoItem[] = hasError
    ? []
    : roomChangeRes.data.roomChanges
        .map((item) => ({
          id: item.id,
          type: "RoomChanged" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: `${item.originalRoom.name} → ${item.newRoom.name}`,
        }))
        .filter((item) => isTodayOrLater(item.date, todayStart))
        .sort(sortByDateAsc);

  const sections: { type: LectureInfoType; items: LectureInfoItem[] }[] = [
    { type: "Cancelled", items: cancelledItems },
    { type: "Makeup", items: makeupItems },
    { type: "RoomChanged", items: roomChangedItems },
  ];

  const totalCount =
    cancelledItems.length + makeupItems.length + roomChangedItems.length;

  return (
    <div>
      {/* Hero Header */}
      <div className="bg-background-tertiary -mx-6 -mt-6 px-6 pt-10 pb-8 mb-8">
        <p className="text-xs font-medium tracking-[0.25em] uppercase mb-3 text-label-tertiary/50">
          Lecture / Information
        </p>
        <div className="flex items-end justify-between">
          <h1 className="text-5xl font-bold tracking-tight text-label-tertiary leading-none">
            休講・補講・教室変更
          </h1>
          {!hasError && (
            <p className="text-sm text-label-tertiary/40 pb-1 tabular-nums">
              {totalCount} 件
            </p>
          )}
        </div>
      </div>

      {hasError ? (
        <div className="py-20 text-center">
          <p className="text-accent-error text-sm">
            情報の取得に失敗しました。
          </p>
        </div>
      ) : totalCount === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">現在、情報はありません</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sections.map((section) => (
            <section key={section.type} id={sectionId(section.type)}>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-base font-bold text-label-primary">
                  {sectionLabel(section.type)}
                </h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${typeBadgeClass(section.type)}`}
                >
                  {section.items.length}件
                </span>
              </div>

              {section.items.length === 0 ? (
                <div className="rounded-lg border border-border-primary bg-background-secondary px-3 py-4">
                  <p className="text-xs text-label-secondary">
                    該当する情報はありません
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border-primary rounded-lg border border-border-primary bg-background-primary">
                  {section.items.map((item) => {
                    const { month, day } = formatDate(item.date);

                    return (
                      <li key={`${item.type}-${item.id}`}>
                        <div className="flex items-baseline gap-2.5 px-3 py-2">
                          <span className="shrink-0 text-sm font-semibold tabular-nums text-label-primary">
                            {month}
                            <span className="text-label-secondary/40">/</span>
                            {day}
                          </span>
                          <span className="shrink-0 text-xs text-label-secondary tabular-nums">
                            {periodLabel(item.period)}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-label-primary truncate">
                              {item.subjectName}
                            </p>
                            <p className="text-xs text-label-secondary truncate">
                              {item.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
