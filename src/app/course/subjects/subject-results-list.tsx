import { ListItem } from "@/components/dotto/list-item";
import Link from "next/link";
import { SEMESTER_LABEL, type Subject } from "./constants";

export function SubjectResultsList({
  isLoading,
  hasError,
  hasCondition,
  subjects,
  slotMap,
}: {
  isLoading: boolean;
  hasError: boolean;
  hasCondition: boolean;
  subjects: Subject[];
  slotMap: Map<string, string[]>;
}) {
  if (isLoading) {
    return (
      <ul>
        {[...Array(10)].map((_, i) => (
          <li key={i}>
            <ListItem
              isLoading
              title=""
              description1=" "
              description2=" "
            />
          </li>
        ))}
      </ul>
    );
  }

  if (hasError) {
    return (
      <p className="py-8 text-center text-sm text-accent-error">
        情報の取得に失敗しました。
      </p>
    );
  }

  if (subjects.length === 0) {
    return (
      <ul>
        <li className="py-8 text-center text-sm text-label-secondary">
          {hasCondition
            ? "該当する科目が見つかりません"
            : "検索条件を入力してください"}
        </li>
      </ul>
    );
  }

  return (
    <ul>
      {subjects.map((subject) => {
        const primaryFaculty = subject.faculties.find(
          (f) => f.isPrimary,
        )?.faculty;
        const otherCount = subject.faculties.length - 1;
        const facultyLabel = primaryFaculty
          ? otherCount > 0
            ? `${primaryFaculty.name} 他${otherCount}名`
            : primaryFaculty.name
          : undefined;
        const infoLabel = [
          SEMESTER_LABEL[subject.semester] ?? subject.semester,
          slotMap.get(subject.id)?.join(","),
          `${subject.credit}単位`,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <li key={subject.id}>
            <Link href={`/course/subjects/${subject.id}`}>
              <ListItem
                title={subject.name}
                description1={infoLabel}
                description2={facultyLabel}
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
