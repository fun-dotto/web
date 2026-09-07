"use client";

import { useState, useEffect } from "react";
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

export default function SubjectsSearchView() {
  const [query, setQuery] = useState("");
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(new Set());
  const [selectedRequiredTypes, setSelectedRequiredTypes] = useState<
    Set<string>
  >(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    new Set(),
  );
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(new Set());
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    new Set(),
  );
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
    if (!hasCondition) {
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
