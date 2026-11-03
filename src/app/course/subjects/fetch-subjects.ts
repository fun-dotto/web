import { SubjectService } from "@/api/app/v1/subject_pb";
import { TimetableItemService } from "@/api/app/v1/timetable_item_pb";
import { apiClient } from "@/lib/api";
import {
  ALL_SEMESTERS,
  CLASS_ENUM,
  CLASSIFICATION_ENUM,
  COURSE_ENUM,
  DAY_MAP,
  GRADE_ENUM,
  REQUIREMENT_TYPE_ENUM,
  SEMESTER_ENUM,
  type Subject,
} from "./constants";

export type ApiSubjectsQuery = {
  q?: string;
  semesters?: string[];
  requirementTypes?: string[];
  classifications?: string[];
  courses?: string[];
  grades?: string[];
  classes?: string[];
};

function toEnums<T>(values: string[] | undefined, map: Record<string, T>): T[] {
  return (values ?? []).flatMap((v) => (v in map ? [map[v]] : []));
}

export async function fetchSubjectsAndSlotsByApiParams(
  params: ApiSubjectsQuery = {},
): Promise<{
  subjects: Subject[];
  hasError: boolean;
  slotEntries: [string, string[]][];
}> {
  const semesters = toEnums(params.semesters, SEMESTER_ENUM);

  const [subjectsRes, timetableRes] = await Promise.allSettled([
    apiClient(SubjectService).listSubjects({
      query: params.q ?? "",
      semesters,
      requirementTypes: toEnums(params.requirementTypes, REQUIREMENT_TYPE_ENUM),
      classifications: toEnums(params.classifications, CLASSIFICATION_ENUM),
      courses: toEnums(params.courses, COURSE_ENUM),
      grades: toEnums(params.grades, GRADE_ENUM),
      classes: toEnums(params.classes, CLASS_ENUM),
    }),
    apiClient(TimetableItemService).listTimetableItems({
      semesters: semesters.length > 0 ? semesters : ALL_SEMESTERS,
    }),
  ]);

  const slotEntries: [string, string[]][] = [];
  if (timetableRes.status === "fulfilled") {
    const map = new Map<string, string[]>();
    for (const item of timetableRes.value.timetableItems) {
      if (item.slot && item.subject) {
        const day = DAY_MAP[item.slot.dayOfWeek] ?? "";
        const label = `${day}${item.slot.period}`;
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

  if (subjectsRes.status === "rejected") {
    return { subjects: [], hasError: true, slotEntries };
  }

  // Client Component に渡すため、Proto のメッセージをプレーンなオブジェクトに変換する
  const subjects: Subject[] = subjectsRes.value.subjects.map((s) => ({
    id: s.id,
    name: s.name,
    semester: s.semester,
    credit: s.credit,
    faculties: s.faculties.map((f) => ({
      faculty: { name: f.faculty?.name ?? "" },
      isPrimary: f.isPrimary,
    })),
  }));

  return { subjects, hasError: false, slotEntries };
}
