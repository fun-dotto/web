import { api } from "@/lib/api";
import {
  ALL_SEMESTERS,
  CATEGORY_MAP,
  COURSE_MAP,
  DAY_MAP,
  GRADE_MAP,
  REQUIRED_TYPE_MAP,
  TERM_MAP,
  type Subject,
} from "./constants";

export type SubjectsSearchParams = {
  query?: string;
  selectedTerms?: Set<string>;
  selectedRequiredTypes?: Set<string>;
  selectedCategories?: Set<string>;
  selectedCourses?: Set<string>;
  selectedGrades?: Set<string>;
  selectedClasses?: Set<string>;
};

function mapSet(
  set: Set<string> | undefined,
  map: Record<string, string>,
): string[] | undefined {
  if (!set || set.size === 0) return undefined;
  const result = [...set].map((v) => map[v]).filter(Boolean);
  return result.length > 0 ? result : undefined;
}

export async function fetchSubjectsAndSlots(
  params: SubjectsSearchParams = {},
  signal?: AbortSignal,
): Promise<{
  subjects: Subject[];
  hasError: boolean;
  slotEntries: [string, string[]][];
}> {
  const mappedTerms = mapSet(params.selectedTerms, TERM_MAP);
  const semesters = mappedTerms ?? ALL_SEMESTERS;

  const [subjectsRes, timetableRes] = await Promise.all([
    api.GET("/v1/subjects", {
      params: {
        query: {
          q: params.query || undefined,
          semesters: mappedTerms as never,
          requirementTypes: mapSet(
            params.selectedRequiredTypes,
            REQUIRED_TYPE_MAP,
          ) as never,
          classifications: mapSet(
            params.selectedCategories,
            CATEGORY_MAP,
          ) as never,
          courses: mapSet(params.selectedCourses, COURSE_MAP) as never,
          grades: mapSet(params.selectedGrades, GRADE_MAP) as never,
          classes:
            params.selectedClasses && params.selectedClasses.size > 0
              ? ([...params.selectedClasses] as never)
              : undefined,
        },
      },
      signal,
    }),
    api.GET("/v1/timetableItems", {
      params: {
        query: { semesters: semesters as never },
      },
      signal,
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
