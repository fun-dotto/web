"use client";

import { useState, useEffect } from "react";
import { SearchIcon, ChevronRightIcon } from "lucide-react";
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
      className={`px-3 py-1 text-sm rounded-full border transition-colors whitespace-nowrap ${
        selected
          ? "bg-background-tertiary text-label-tertiary border-background-tertiary"
          : "bg-background-secondary text-label-primary border-border-primary hover:bg-background-primary"
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
      <p className="text-xs text-label-secondary mb-2">{label}</p>
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
  return (
    <div className="border border-border-primary rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-background-primary border-b border-border-primary">
        <h2 className="text-sm font-semibold text-label-primary">{title}</h2>
      </div>
      <div className="px-4 py-4 space-y-4 bg-background-secondary">{children}</div>
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

  useEffect(() => {
    const controller = new AbortController();
    const mapSet = (set: Set<string>, map: Record<string, string>) => {
      const result = [...set].map((v) => map[v]).filter(Boolean);
      return result.length > 0 ? result : undefined;
    };

    if (!hasCondition) {
      setSubjects([]);
      setHasError(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const { data, error } = await api.GET("/v1/subjects", {
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
        });
        if (error || !data) {
          setHasError(true);
        } else {
          setSubjects(data.subjects);
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
  }, [query, selectedTerms, selectedRequiredTypes, selectedCategories, selectedCourses, selectedGrades, selectedClasses]);

  return (
    <div className="space-y-4">
      {/* 検索入力 */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label-secondary pointer-events-none" />
        <Input
          placeholder="科目名で検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
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

      {/* 検索結果 */}
      {isLoading ? (
        <ul className="divide-y divide-border-primary">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="py-4 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </li>
          ))}
        </ul>
      ) : hasError ? (
        <p className="py-8 text-center text-sm text-accent-error">
          情報の取得に失敗しました。
        </p>
      ) : (
        <ul className="divide-y divide-border-primary">
          {subjects.length === 0 ? (
            <li className="py-8 text-center text-sm text-label-secondary">
              {hasCondition ? "該当する科目が見つかりません" : "検索条件を入力してください"}
            </li>
          ) : (
            subjects.map((subject) => {
              const primaryFaculty = subject.faculties.find((f) => f.isPrimary)?.faculty;
              return (
                <li key={subject.id}>
                  <button className="w-full flex items-center justify-between py-4 text-left hover:bg-background-primary transition-colors -mx-2 px-2 rounded-lg">
                    <div className="min-w-0">
                      <p className="font-medium text-label-primary">{subject.name}</p>
                      <p className="text-sm text-label-secondary mt-0.5">{subject.credit}単位</p>
                      {primaryFaculty && (
                        <p className="text-sm text-label-secondary">{primaryFaculty.name}</p>
                      )}
                    </div>
                    <ChevronRightIcon className="w-4 h-4 text-label-secondary shrink-0 ml-2" />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
