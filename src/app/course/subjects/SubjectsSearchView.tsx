"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  TERMS,
  REQUIRED_TYPES,
  CATEGORIES,
  COURSES,
  GRADES,
  CLASSES,
  TERM_MAP,
  REQUIRED_TYPE_MAP,
  CATEGORY_MAP,
  COURSE_MAP,
  GRADE_MAP,
  toggle,
  type Subject,
} from "./constants";
import { fetchSubjectsAndSlots } from "./fetch-subjects";
import { FilterGroup, FilterSection } from "./filter-controls";
import { SubjectResultsList } from "./subject-results-list";
import { PageHeaderActions } from "@/contexts/page-header-context";

const SESSION_STORAGE_KEY = "subjects-search-state";

const PARAM_KEYS = {
  query: "q",
  selectedTerms: "semesters",
  selectedRequiredTypes: "requirementTypes",
  selectedCategories: "classifications",
  selectedCourses: "courses",
  selectedGrades: "grades",
  selectedClasses: "classes",
} as const;

function invertMap(map: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
}

const TERM_REVERSE_MAP = invertMap(TERM_MAP);
const REQUIRED_TYPE_REVERSE_MAP = invertMap(REQUIRED_TYPE_MAP);
const CATEGORY_REVERSE_MAP = invertMap(CATEGORY_MAP);
const COURSE_REVERSE_MAP = invertMap(COURSE_MAP);
const GRADE_REVERSE_MAP = invertMap(GRADE_MAP);

type StoredState = {
  search: string;
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

function parseSet(
  params: URLSearchParams,
  key: string,
  reverseMap?: Record<string, string>,
): Set<string> {
  const value = params.get(key);
  if (!value) return new Set();
  const values = value.split(",").filter(Boolean);
  if (!reverseMap) return new Set(values);
  return new Set(values.map((v) => reverseMap[v]).filter(Boolean));
}

function buildSearchParams({
  query,
  selectedTerms,
  selectedRequiredTypes,
  selectedCategories,
  selectedCourses,
  selectedGrades,
  selectedClasses,
}: {
  query: string;
  selectedTerms: Set<string>;
  selectedRequiredTypes: Set<string>;
  selectedCategories: Set<string>;
  selectedCourses: Set<string>;
  selectedGrades: Set<string>;
  selectedClasses: Set<string>;
}): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set(PARAM_KEYS.query, query);
  const setEntries: [string, Set<string>, Record<string, string> | undefined][] = [
    [PARAM_KEYS.selectedTerms, selectedTerms, TERM_MAP],
    [PARAM_KEYS.selectedRequiredTypes, selectedRequiredTypes, REQUIRED_TYPE_MAP],
    [PARAM_KEYS.selectedCategories, selectedCategories, CATEGORY_MAP],
    [PARAM_KEYS.selectedCourses, selectedCourses, COURSE_MAP],
    [PARAM_KEYS.selectedGrades, selectedGrades, GRADE_MAP],
    [PARAM_KEYS.selectedClasses, selectedClasses, undefined],
  ];
  for (const [key, set, map] of setEntries) {
    if (set.size === 0) continue;
    const values = map ? [...set].map((v) => map[v]).filter(Boolean) : [...set];
    if (values.length > 0) params.set(key, values.join(","));
  }
  return params;
}

export default function SubjectsSearchView({
  initialHasCondition,
  initialHasError,
  initialSubjects,
  initialSlotEntries,
}: {
  initialHasCondition: boolean;
  initialHasError: boolean;
  initialSubjects: Subject[];
  initialSlotEntries: [string, string[]][];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialParams = useRef(
    new URLSearchParams(searchParams.toString()),
  ).current;
  const lastSyncedSearch = useRef(initialParams.toString());
  const restored = useRef(loadStoredState()).current;
  const hasMatchingCache =
    !initialHasCondition && restored?.search === initialParams.toString();

  const [query, setQuery] = useState(
    initialParams.get(PARAM_KEYS.query) ?? "",
  );
  const [selectedTerms, setSelectedTerms] = useState<Set<string>>(
    parseSet(initialParams, PARAM_KEYS.selectedTerms, TERM_REVERSE_MAP),
  );
  const [selectedRequiredTypes, setSelectedRequiredTypes] = useState<
    Set<string>
  >(
    parseSet(
      initialParams,
      PARAM_KEYS.selectedRequiredTypes,
      REQUIRED_TYPE_REVERSE_MAP,
    ),
  );
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    parseSet(
      initialParams,
      PARAM_KEYS.selectedCategories,
      CATEGORY_REVERSE_MAP,
    ),
  );
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(
    parseSet(initialParams, PARAM_KEYS.selectedCourses, COURSE_REVERSE_MAP),
  );
  const [selectedGrades, setSelectedGrades] = useState<Set<string>>(
    parseSet(initialParams, PARAM_KEYS.selectedGrades, GRADE_REVERSE_MAP),
  );
  const [selectedClasses, setSelectedClasses] = useState<Set<string>>(
    parseSet(initialParams, PARAM_KEYS.selectedClasses),
  );
  const [subjects, setSubjects] = useState<Subject[]>(
    initialHasCondition
      ? initialSubjects
      : hasMatchingCache
        ? (restored?.subjects ?? [])
        : [],
  );
  const [slotMap, setSlotMap] = useState<Map<string, string[]>>(
    new Map(
      initialHasCondition
        ? initialSlotEntries
        : hasMatchingCache
          ? restored?.slotEntries
          : undefined,
    ),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(initialHasError);
  const [hasSearched, setHasSearched] = useState(initialHasCondition);
  const skipNextFetch = useRef(initialHasCondition || hasMatchingCache);
  const pendingAbort = useRef<AbortController | null>(null);
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    setHasSearched(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
    router.replace(pathname, { scroll: false });
  }

  async function runSearch(signal: AbortSignal) {
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
        signal,
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
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    pendingAbort.current?.abort();
    skipNextFetch.current = false;
    setHasSearched(true);
    const controller = new AbortController();
    pendingAbort.current = controller;
    void runSearch(controller.signal);
  }

  useEffect(() => {
    const params = buildSearchParams({
      query,
      selectedTerms,
      selectedRequiredTypes,
      selectedCategories,
      selectedCourses,
      selectedGrades,
      selectedClasses,
    });
    const search = params.toString();
    const url = search ? `${pathname}?${search}` : pathname;
    lastSyncedSearch.current = search;
    router.replace(url, { scroll: false });

    if (!hasCondition) {
      return;
    }

    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    const controller = new AbortController();
    pendingAbort.current = controller;

    const timer = setTimeout(
      () => {
        void runSearch(controller.signal);
      },
      query ? 300 : 0,
    );
    pendingTimer.current = timer;

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
    pathname,
    router,
  ]);

  useEffect(() => {
    const currentSearch = searchParams.toString();
    if (currentSearch === lastSyncedSearch.current) {
      return;
    }
    lastSyncedSearch.current = currentSearch;
    if (currentSearch) {
      return;
    }
    // サイドバーの「科目検索」リンクなど、自分の router.replace 以外の
    // 要因でクエリパラメータが空になった場合は検索条件をリセットする
    pendingTimer.current && clearTimeout(pendingTimer.current);
    pendingAbort.current?.abort();
    skipNextFetch.current = false;
    setQuery("");
    setSelectedTerms(new Set());
    setSelectedRequiredTypes(new Set());
    setSelectedCategories(new Set());
    setSelectedCourses(new Set());
    setSelectedGrades(new Set());
    setSelectedClasses(new Set());
    setSubjects([]);
    setSlotMap(new Map());
    setHasSearched(false);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!hasCondition) {
      window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    const search = buildSearchParams({
      query,
      selectedTerms,
      selectedRequiredTypes,
      selectedCategories,
      selectedCourses,
      selectedGrades,
      selectedClasses,
    }).toString();
    const stored: StoredState = {
      search,
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

  const displaySubjects = hasCondition || hasSearched ? subjects : [];

  return (
    <div className="flex flex-col @[768px]:flex-row items-stretch @[768px]:items-start gap-4 h-[calc(100svh-6rem)] min-h-0">
      {(hasCondition || hasSearched) && (
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
        <form onSubmit={handleSubmit} className="relative py-3">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label-secondary pointer-events-none" />
          <Input
            placeholder="科目名で検索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 border border-border-primary shadow-none bg-background-secondary focus-visible:ring-0"
          />
        </form>

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
      <div className="flex-1 min-w-0 h-full min-h-0 overflow-y-auto">
        {/* 検索結果 */}
        <SubjectResultsList
          isLoading={isLoading}
          hasError={hasError}
          hasCondition={hasCondition || hasSearched}
          subjects={displaySubjects}
          slotMap={slotMap}
        />
      </div>
    </div>
  );
}
