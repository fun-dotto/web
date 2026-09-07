"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  TERMS,
  REQUIRED_TYPES,
  CATEGORIES,
  COURSES,
  GRADES,
  CLASSES,
  toggle,
  type Subject,
} from "./constants";
import { fetchSubjectsAndSlots } from "./fetch-subjects";
import { FilterGroup, FilterSection } from "./filter-controls";
import { SubjectResultsList } from "./subject-results-list";
import { PageHeaderActions } from "@/contexts/page-header-context";

const SESSION_STORAGE_KEY = "subjects-search-state";

type StoredState = {
  query: string;
  selectedTerms: string[];
  selectedRequiredTypes: string[];
  selectedCategories: string[];
  selectedCourses: string[];
  selectedGrades: string[];
  selectedClasses: string[];
  subjects: Subject[];
  slotEntries: [string, string[]][];
};

function loadStoredState(): StoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredState;
  } catch {
    return null;
  }
}

export default function SubjectsSearchView() {
  const restored = useRef(loadStoredState()).current;

  const [query, setQuery] = useState(restored?.query ?? "");
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(
    new Set(restored?.selectedTerms),
  );
  const [selectedRequiredTypes, setSelectedRequiredTypes] = useState<
    Set<string>
  >(new Set(restored?.selectedRequiredTypes));
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(restored?.selectedCategories),
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set(restored?.selectedCourses),
  );
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(
    new Set(restored?.selectedGrades),
  );
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set(restored?.selectedClasses),
  );
  const [subjects, setSubjects] = useState<Subject[]>(
    restored?.subjects ?? [],
  );
  const [slotMap, setSlotMap] = useState<Map<string, string[]>>(
    new Map(restored?.slotEntries),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const skipNextFetch = useRef(restored !== null);

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
    setSubjects([]);
    setSlotMap(new Map());
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }

  useEffect(() => {
    if (!hasCondition) {
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(
      async () => {
        setIsLoading(true);
        setHasError(false);
        try {
          const result = await fetchSubjectsAndSlots(
            {
              query,
              selectedTerms,
              selectedRequiredTypes,
              selectedCategories,
              selectedCourses,
              selectedGrades,
              selectedClasses,
            },
            controller.signal,
          );
          if (result.hasError) {
            setHasError(true);
          } else {
            setSubjects(result.subjects);
            setSlotMap(new Map(result.slotEntries));
          }
        } catch {
          // abort によるキャンセルは無視する
        } finally {
          setIsLoading(false);
        }
      },
      query ? 300 : 0,
    );

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    query,
    selectedTerms,
    selectedRequiredTypes,
    selectedCategories,
    selectedCourses,
    selectedGrades,
    selectedClasses,
    hasCondition,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasCondition) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    const stored: StoredState = {
      query,
      selectedTerms: [...selectedTerms],
      selectedRequiredTypes: [...selectedRequiredTypes],
      selectedCategories: [...selectedCategories],
      selectedCourses: [...selectedCourses],
      selectedGrades: [...selectedGrades],
      selectedClasses: [...selectedClasses],
      subjects,
      slotEntries: [...slotMap.entries()],
    };
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(stored));
  }, [
    query,
    selectedTerms,
    selectedRequiredTypes,
    selectedCategories,
    selectedCourses,
    selectedGrades,
    selectedClasses,
    subjects,
    slotMap,
    hasCondition,
  ]);

  const displaySubjects = hasCondition ? subjects : [];

  return (
    <div className="flex flex-col @[768px]:flex-row items-stretch @[768px]:items-start gap-4">
      {hasCondition && (
        <PageHeaderActions>
          <button
            onClick={clearAll}
            className="text-sm text-label-secondary hover:text-label-primary transition-colors"
          >
            条件をクリア
          </button>
        </PageHeaderActions>
      )}
      {/* 左カラム: 検索入力 + フィルター */}
      <div className="w-full @[768px]:w-72 shrink-0 space-y-0">
        {/* 検索入力 */}
        <div className="relative py-3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label-secondary pointer-events-none" />
          <Input
            placeholder="科目名で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 border border-border-primary shadow-none bg-background-secondary focus-visible:ring-0"
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
            onToggle={(v) =>
              setSelectedRequiredTypes(toggle(selectedRequiredTypes, v))
            }
          />
          <FilterGroup
            label="分類"
            options={CATEGORIES}
            selected={selectedCategories}
            onToggle={(v) =>
              setSelectedCategories(toggle(selectedCategories, v))
            }
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

      {/* 右カラム: 検索結果 */}
      <div className="flex-1 min-w-0">
        {/* 検索結果 */}
        <SubjectResultsList
          isLoading={isLoading}
          hasError={hasError}
          hasCondition={hasCondition}
          subjects={displaySubjects}
          slotMap={slotMap}
        />
      </div>
    </div>
  );
}
