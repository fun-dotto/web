"use client";

import { useState, useEffect } from "react";
import { SearchIcon, ChevronUpIcon } from "lucide-react";
import { ListItem } from "@/components/dotto/list-item";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import type { components } from "@/types/api";

const TERMS = ["前期", "後期", "通年", "第1クォーター", "第2クォーター", "第3クォーター", "第4クォーター", "夏季集中", "冬季集中"];
const REQUIRED_TYPES = ["必修", "選択", "必修選択"];
const CATEGORIES = ["専門", "教養", "研究指導"];
const COURSES = ["情報システム/情報アーキテクチャ", "情報デザイン/メディアデザイン", "複雑系/複雑系情報学科", "知能システム/知能情報学科", "高度ICT"];
const GRADES = ["学部1年", "学部２年", "学部3年", "学部4年", "修士１", "修士２"];
const CLASSES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const TERM_MAP: Record<string, string> = {
  "前期": "H1", "後期": "H2", "通年": "AllYear",
  "第1クォーター": "Q1", "第2クォーター": "Q2",
  "第3クォーター": "Q3", "第4クォーター": "Q4",
  "夏季集中": "SummerIntensive", "冬季集中": "WinterIntensive",
};
const REQUIRED_TYPE_MAP: Record<string, string> = {
  "必修": "Required", "選択": "Optional", "必修選択": "OptionalRequired",
};
const CATEGORY_MAP: Record<string, string> = {
  "専門": "Specialized", "教養": "Cultural", "研究指導": "ResearchInstruction",
};
const COURSE_MAP: Record<string, string> = {
  "情報システム/情報アーキテクチャ": "InformationSystem",
  "情報デザイン/メディアデザイン": "InformationDesign",
  "複雑系/複雑系情報学科": "ComplexSystem",
  "知能システム/知能情報学科": "IntelligentSystem",
  "高度ICT": "AdvancedICT",
};
const GRADE_MAP: Record<string, string> = {
  "学部1年": "B1", "学部２年": "B2", "学部3年": "B3", "学部4年": "B4",
  "修士１": "M1", "修士２": "M2",
};

const SEMESTER_LABEL: Record<string, string> = {
  H1: "前期", H2: "後期", AllYear: "通年",
  Q1: "第1Q", Q2: "第2Q", Q3: "第3Q", Q4: "第4Q",
  SummerIntensive: "夏季集中", WinterIntensive: "冬季集中",
};

const DAY_MAP: Record<string, string> = {
  Monday: "月", Tuesday: "火", Wednesday: "水",
  Thursday: "木", Friday: "金", Saturday: "土", Sunday: "日",
};

const ALL_SEMESTERS = Object.values(TERM_MAP);

type Subject = components["schemas"]["SubjectSummary"];

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-lg border-2 transition-colors whitespace-nowrap ${
        selected
          ? "bg-accent-brand text-label-tertiary border-accent-brand"
          : "bg-background-secondary text-label-secondary border-border-primary hover:border-accent-brand"
      }`}
    >
      {label}
    </button>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-label-secondary mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            selected={selected.has(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b-2 border-border-primary">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-base font-medium text-label-primary">{title}</span>
        <ChevronUpIcon
          className={`w-5 h-5 text-label-secondary transition-transform shrink-0 ${open ? "" : "rotate-180"}`}
        />
      </button>
      {open && <div className="pb-4 space-y-4">{children}</div>}
    </div>
  );
}

export default function SubjectsSearchView() {
  const [query, setQuery] = useState("");
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(new Set());
  const [selectedRequiredTypes, setSelectedRequiredTypes] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set());
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(new Set());
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [slotMap, setSlotMap] = useState<Map<string, string[]>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hasCondition =
    query.length > 0 ||
    selectedTerms.size > 0 ||
    selectedRequiredTypes.size > 0 ||
    selectedCategories.size > 0 ||
    selectedCourses.size > 0 ||
    selectedGrades.size > 0 ||
    selectedClasses.size > 0;

  function clearAll() {
    setQuery("");
    setSelectedTerms(new Set());
    setSelectedRequiredTypes(new Set());
    setSelectedCategories(new Set());
    setSelectedCourses(new Set());
    setSelectedGrades(new Set());
    setSelectedClasses(new Set());
  }

  useEffect(() => {
    const controller = new AbortController();
    const mapSet = (set: Set<string>, map: Record<string, string>) => {
      const result = [...set].map((v) => map[v]).filter(Boolean);
      return result.length > 0 ? result : undefined;
    };

    if (!hasCondition) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const semesters = selectedTerms.size > 0
          ? mapSet(selectedTerms, TERM_MAP)!
          : ALL_SEMESTERS;

        const [subjectsRes, timetableRes] = await Promise.all([
          api.GET("/v1/subjects", {
            params: {
              query: {
                q: query || undefined,
                semesters: mapSet(selectedTerms, TERM_MAP) as never,
                requirementTypes: mapSet(selectedRequiredTypes, REQUIRED_TYPE_MAP) as never,
                classifications: mapSet(selectedCategories, CATEGORY_MAP) as never,
                courses: mapSet(selectedCourses, COURSE_MAP) as never,
                grades: mapSet(selectedGrades, GRADE_MAP) as never,
                classes: selectedClasses.size > 0 ? ([...selectedClasses] as never) : undefined,
              },
            },
            signal: controller.signal,
          }),
          api.GET("/v1/timetableItems", {
            params: {
              query: { semesters: semesters as never },
            },
            signal: controller.signal,
          }),
        ]);

        if (subjectsRes.error || !subjectsRes.data) {
          setHasError(true);
        } else {
          setSubjects(subjectsRes.data.subjects);
        }

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
          setSlotMap(map);
        }
      } catch {
        // abort によるキャンセルは無視する
      } finally {
        setIsLoading(false);
      }
    }, query ? 300 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, selectedTerms, selectedRequiredTypes, selectedCategories, selectedCourses, selectedGrades, selectedClasses, hasCondition]);

  const displaySubjects = hasCondition ? subjects : [];

  return (
    <div className="flex items-start gap-4">
      {/* 左カラム: 検索入力 + フィルター */}
      <div className="w-72 shrink-0 space-y-0">
        {/* 検索入力 */}
        <div className="relative border-b-2 border-border-primary py-3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label-secondary pointer-events-none" />
          <Input
            placeholder="科目名で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 border-none shadow-none bg-transparent focus-visible:ring-0"
          />
        </div>

        {/* フィルター: 開校時期・必修/選択・分類 */}
        <FilterSection title="開校時期・必修/選択・分類">
          <FilterGroup
            label="開講時期"
            options={TERMS}
            selected={selectedTerms}
            onToggle={(v) => setSelectedTerms(toggle(selectedTerms, v))}
          />
          <FilterGroup
            label="必修/選択"
            options={REQUIRED_TYPES}
            selected={selectedRequiredTypes}
            onToggle={(v) => setSelectedRequiredTypes(toggle(selectedRequiredTypes, v))}
          />
          <FilterGroup
            label="分類"
            options={CATEGORIES}
            selected={selectedCategories}
            onToggle={(v) => setSelectedCategories(toggle(selectedCategories, v))}
          />
        </FilterSection>

        {/* フィルター: コース/領域・学年・クラス */}
        <FilterSection title="コース/領域・学年・クラス">
          <FilterGroup
            label="コース/領域"
            options={COURSES}
            selected={selectedCourses}
            onToggle={(v) => setSelectedCourses(toggle(selectedCourses, v))}
          />
          <FilterGroup
            label="学年"
            options={GRADES}
            selected={selectedGrades}
            onToggle={(v) => setSelectedGrades(toggle(selectedGrades, v))}
          />
          <FilterGroup
            label="クラス"
            options={CLASSES}
            selected={selectedClasses}
            onToggle={(v) => setSelectedClasses(toggle(selectedClasses, v))}
          />
        </FilterSection>
      </div>

      {/* 右カラム: 条件クリア + 検索結果 */}
      <div className="flex-1 min-w-0">
        {/* 条件をクリア */}
        <div className="flex justify-end py-3 border-b-2 border-border-primary">
          {hasCondition && (
            <button
              onClick={clearAll}
              className="text-sm text-label-secondary hover:text-label-primary transition-colors"
            >
              条件をクリア
            </button>
          )}
        </div>

        {/* 検索結果 */}
        {isLoading ? (
          <ul>
            {[...Array(3)].map((_, i) => (
              <li key={i} className="py-4 space-y-2 border-b-2 border-border-primary">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-40" />
              </li>
            ))}
          </ul>
        ) : hasError ? (
          <p className="py-8 text-center text-sm text-accent-error">
            情報の取得に失敗しました。
          </p>
        ) : (
          <ul>
            {displaySubjects.length === 0 ? (
              <li className="py-8 text-center text-sm text-label-secondary">
                {hasCondition ? "該当する科目が見つかりません" : "検索条件を入力してください"}
              </li>
            ) : (
              displaySubjects.map((subject) => {
                const primaryFaculty = subject.faculties.find((f) => f.isPrimary)?.faculty;
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
                ].filter(Boolean).join(" ");
                return (
<<<<<<< HEAD
                  <li key={subject.id} className="border-b-2 border-border-primary">
                    <div className="w-full flex flex-col gap-0.5 py-4">
                      <p className="font-medium text-label-primary">{subject.name}</p>
                      <p className="text-sm leading-[1.2] text-label-secondary">
                        {[
                          SEMESTER_LABEL[subject.semester] ?? subject.semester,
                          slotMap.get(subject.id)?.join(","),
                          `${subject.credit}単位`,
                        ].filter(Boolean).join(" ")}
                      </p>
                      {facultyLabel && (
                        <p className="text-sm text-label-secondary">{facultyLabel}</p>
                      )}
                    </div>
=======
                  <li key={subject.id}>
                    <ListItem
                      title={subject.name}
                      descriptions={[infoLabel, facultyLabel].filter(Boolean) as string[]}
                    />
>>>>>>> 15bc743 (科目検索結果の表示にListItemコンポーネントを使用する)
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
