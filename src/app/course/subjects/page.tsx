import type { Metadata } from "next";
import { Suspense } from "react";
import SubjectsSearchView from "@/app/course/subjects/SubjectsSearchView";
import { fetchSubjectsAndSlotsByApiParams } from "@/app/course/subjects/fetch-subjects";

export const metadata: Metadata = {
  title: "科目検索",
  description: "科目を検索する",
};

type SearchParams = Record<string, string | string[] | undefined>;

function getParam(searchParams: SearchParams, key: string): string[] {
  const value = searchParams[key];
  const raw = Array.isArray(value) ? value[0] : value;
  return raw ? raw.split(",").filter(Boolean) : [];
}

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const query = getParam(sp, "q")[0] ?? "";
  const semesters = getParam(sp, "semesters");
  const requirementTypes = getParam(sp, "requirementTypes");
  const classifications = getParam(sp, "classifications");
  const courses = getParam(sp, "courses");
  const grades = getParam(sp, "grades");
  const classes = getParam(sp, "classes");

  const hasCondition =
    query.length > 0 ||
    semesters.length > 0 ||
    requirementTypes.length > 0 ||
    classifications.length > 0 ||
    courses.length > 0 ||
    grades.length > 0 ||
    classes.length > 0;

  const initial = hasCondition
    ? await fetchSubjectsAndSlotsByApiParams({
        q: query || undefined,
        semesters: semesters.length > 0 ? semesters : undefined,
        requirementTypes:
          requirementTypes.length > 0 ? requirementTypes : undefined,
        classifications:
          classifications.length > 0 ? classifications : undefined,
        courses: courses.length > 0 ? courses : undefined,
        grades: grades.length > 0 ? grades : undefined,
        classes: classes.length > 0 ? classes : undefined,
      })
    : null;

  return (
    <Suspense>
      <SubjectsSearchView
        initialHasCondition={hasCondition}
        initialHasError={initial?.hasError ?? false}
        initialSubjects={initial?.subjects ?? []}
        initialSlotEntries={initial?.slotEntries ?? []}
      />
    </Suspense>
  );
}
