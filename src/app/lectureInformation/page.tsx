import type { Metadata } from "next";
import { api } from "@/lib/api";

export const metadata: Metadata = {
  title: "休講・補講・教室変更",
  description: "休講・補講・教室変更情報の一覧",
};

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

  const items: LectureInfoItem[] = hasError
    ? []
    : [
        ...cancelledRes.data.cancelledClasses.map((item) => ({
          id: item.id,
          type: "Cancelled" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: item.comment,
        })),
        ...makeupRes.data.makeupClasses.map((item) => ({
          id: item.id,
          type: "Makeup" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: item.comment,
        })),
        ...roomChangeRes.data.roomChanges.map((item) => ({
          id: item.id,
          type: "RoomChanged" as const,
          date: item.date,
          period: item.period,
          subjectName: item.subject.name,
          detail: `${item.originalRoom.name} → ${item.newRoom.name}`,
        })),
      ].sort((a, b) => {
        const aTime = new Date(`${a.date}T00:00:00`).getTime();
        const bTime = new Date(`${b.date}T00:00:00`).getTime();
        return bTime - aTime;
      });

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
              {items.length} 件
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
      ) : items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-label-secondary text-sm">現在、情報はありません</p>
        </div>
      ) : (
        <ul className="divide-y divide-border-primary">
          {items.map((item) => {
            const { year, month, day } = formatDate(item.date);

            return (
              <li key={`${item.type}-${item.id}`}>
                <div className="group flex items-center gap-5 py-4 -mx-2 px-2 rounded-lg hover:bg-background-secondary transition-colors duration-200">
                  {/* Date block */}
                  <div className="shrink-0 w-14 flex flex-col items-center justify-center text-center tabular-nums">
                    <span className="text-[10px] tracking-widest text-label-secondary/60">
                      {year}
                    </span>
                    <span className="text-lg font-semibold leading-none text-label-primary">
                      {month}
                      <span className="text-label-secondary/40">/</span>
                      {day}
                    </span>
                  </div>

                  {/* Divider */}
                  <span
                    aria-hidden
                    className="w-px self-stretch bg-border-primary"
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${typeBadgeClass(item.type)}`}
                      >
                        {typeLabel(item.type)}
                      </span>
                      <span className="text-xs text-label-secondary">
                        {periodLabel(item.period)}
                      </span>
                    </div>
                    <p className="font-semibold text-label-primary line-clamp-2">
                      {item.subjectName}
                    </p>
                    <p className="text-sm text-label-secondary mt-1 line-clamp-2">
                      {item.detail}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
