"use client";

import { useState } from "react";
import { SearchIcon, ChevronRightIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const TERMS = ["前期", "後期", "通年", "第1クォーター", "第2クォーター", "第3クォーター", "第4クォーター", "夏季集中", "冬季集中"];
const REQUIRED_TYPES = ["必修", "選択", "必修選択"];
const CATEGORIES = ["専門", "教養", "研究指導"];
const COURSES = ["情報システム/情報アーキテクチャ", "情報デザイン/メディアデザイン", "複雑系/複雑系情報学科", "知能システム/知能情報学科", "高度ICT"];
const GRADES = ["学部1年", "学部２年", "学部3年", "学部4年", "修士１", "修士２"];
const CLASSES = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

const MOCK_SUBJECTS = [
  { id: "1", title: "プログラミング基礎", timeCredits: "90分  2単位", teacher: "田中 太郎" },
  { id: "2", title: "データ構造とアルゴリズム", timeCredits: "90分  2単位", teacher: "鈴木 花子" },
  { id: "3", title: "コンピュータネットワーク", timeCredits: "90分  2単位", teacher: "佐藤 一郎" },
  { id: "4", title: "オブジェクト指向プログラミング", timeCredits: "90分  2単位", teacher: "山田 次郎" },
  { id: "5", title: "データベース設計", timeCredits: "90分  2単位", teacher: "伊藤 三郎" },
];

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
      <ul className="divide-y divide-border-primary">
        {MOCK_SUBJECTS.map((subject) => (
          <li key={subject.id}>
            <button className="w-full flex items-center justify-between py-4 text-left hover:bg-background-primary transition-colors -mx-2 px-2 rounded-lg">
              <div className="min-w-0">
                <p className="font-medium text-label-primary">{subject.title}</p>
                <p className="text-sm text-label-secondary mt-0.5">{subject.timeCredits}</p>
                <p className="text-sm text-label-secondary">{subject.teacher}</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-label-secondary shrink-0 ml-2" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
