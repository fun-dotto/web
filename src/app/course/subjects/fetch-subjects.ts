import { api } from "@/lib/api";
import { ALL_SEMESTERS, DAY_MAP, type Subject } from "./constants";

export type ApiSubjectsQuery = {
  q?: string;
  semesters?: string[];
  requirementTypes?: string[];
  classifications?: string[];
  courses?: string[];
  grades?: string[];
  classes?: string[];
};

export async function fetchSubjectsAndSlotsByApiParams(
  params: ApiSubjectsQuery = {},
): Promise<{
  subjects: Subject[];
  hasError: boolean;
  slotEntries: [string, string[]][];
}> {
  const semesters =
    params.semesters && params.semesters.length > 0
      ? params.semesters
      : ALL_SEMESTERS;

  const [subjectsRes, timetableRes] = await Promise.all([
    api.GET("/v1/subjects", {
      params: {
        query: {
          q: params.q || undefined,
          semesters: params.semesters as never,
          requirementTypes: params.requirementTypes as never,
          classifications: params.classifications as never,
          courses: params.courses as never,
          grades: params.grades as never,
          classes: params.classes as never,
        },
      },
    }),
    api.GET("/v1/timetableItems", {
      params: {
        query: { semesters: semesters as never },
      },
    }),
  ]);

  const slotEntries: [string, string[]][] = [];
  if (timetableRes.data) {
    const map = new Map<string, string[]>();
    for (const item of timetableRes.data.timetableItems) {
      if (item.slot) {
        const day = DAY_MAP[item.slot.dayOfWeek] ?? "";
        const period = item.slot.period.replace("Period", "");
        const label = `${day}${period}`;
        const existing = map.get(item.subject.id);
        if (existing) {
          existing.push(label);
        } else {
          map.set(item.subject.id, [label]);
        }
      }
    }
    slotEntries.push(...map.entries());
  }

  return {
    subjects: subjectsRes.data?.subjects ?? [],
    hasError: !!subjectsRes.error || !subjectsRes.data,
    slotEntries,
  };
}
