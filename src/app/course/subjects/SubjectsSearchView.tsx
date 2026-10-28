"use client";

import { SearchIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { PageHeaderActions } from "@/contexts/page-header-context";
import {
  CATEGORIES,
  CATEGORY_MAP,
  CLASSES,
  COURSE_MAP,
  COURSES,
  GRADE_MAP,
  GRADES,
  REQUIRED_TYPE_MAP,
  REQUIRED_TYPES,
  type Subject,
  TERM_MAP,
  TERMS,
  toggle,
} from "./constants";
import { FilterGroup, FilterSection } from "./filter-controls";
import { SubjectResultsList } from "./subject-results-list";

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
  const setEntries: [
    string,
    Set<string>,
    Record<string, string> | undefined,
  ][] = [
    [PARAM_KEYS.selectedTerms, selectedTerms, TERM_MAP],
    [
      PARAM_KEYS.selectedRequiredTypes,
      selectedRequiredTypes,
      REQUIRED_TYPE_MAP,
    ],
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
  hasError,
  subjects,
  slotEntries,
}: {
  hasError: boolean;
  subjects: Subject[];
  slotEntries: [string, string[]][];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialParams = useRef(
    new URLSearchParams(searchParams.toString()),
  ).current;
  const lastSyncedSearch = useRef(initialParams.toString());
  const pendingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialParams.get(PARAM_KEYS.query) ?? "");
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
  const slotMap = useMemo(() => new Map(slotEntries), [slotEntries]);

  const hasCondition =
    query.length > 0 ||
    selectedTerms.size > 0 ||
    selectedRequiredTypes.size > 0 ||
    selectedCategories.size > 0 ||
    selectedCourses.size > 0 ||
    selectedGrades.size > 0 ||
    selectedClasses.size > 0;

  const search = buildSearchParams({
    query,
    selectedTerms,
    selectedRequiredTypes,
    selectedCategories,
    selectedCourses,
    selectedGrades,
    selectedClasses,
  }).toString();

  // 検索条件を URL に反映し、Server Component 側で検索結果を再取得させる
  function navigate(nextSearch: string) {
    lastSyncedSearch.current = nextSearch;
    const url = nextSearch ? `${pathname}?${nextSearch}` : pathname;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function clearAll() {
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    setQuery("");
    setSelectedTerms(new Set());
    setSelectedRequiredTypes(new Set());
    setSelectedCategories(new Set());
    setSelectedCourses(new Set());
    setSelectedGrades(new Set());
    setSelectedClasses(new Set());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pendingTimer.current) clearTimeout(pendingTimer.current);
    if (search === searchParams.toString()) {
      startTransition(() => {
        router.refresh();
      });
      return;
    }
    navigate(search);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: navigate は毎レンダー再生成されるため依存に含めない
  useEffect(() => {
    if (search === lastSyncedSearch.current) {
      return;
    }
    const timer = setTimeout(() => navigate(search), query ? 300 : 0);
    pendingTimer.current = timer;
    return () => clearTimeout(timer);
  }, [search]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: clearAll は毎レンダー再生成されるため依存に含めない
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
    clearAll();
  }, [searchParams]);

  return (
    <div className="flex flex-col @[768px]:flex-row items-stretch @[768px]:items-start gap-4 h-[calc(100svh-6rem)] min-h-0 max-w-5xl mx-auto">
      {hasCondition && (
        <PageHeaderActions>
          <button
            type="button"
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
          isLoading={isPending}
          hasError={hasCondition && hasError}
          hasCondition={hasCondition}
          subjects={hasCondition ? subjects : []}
          slotMap={slotMap}
        />
      </div>
    </div>
  );
}
