import type { components } from "@/types/api";

export type Subject = components["schemas"]["SubjectSummary"];

export const TERMS = [
  "前期",
  "後期",
  "通年",
  "第1クォーター",
  "第2クォーター",
  "第3クォーター",
  "第4クォーター",
  "夏季集中",
  "冬季集中",
];
export const REQUIRED_TYPES = ["必修", "選択", "必修選択"];
export const CATEGORIES = ["専門", "教養", "研究指導"];
export const COURSES = [
  "情報システム/情報アーキテクチャ",
  "情報デザイン/メディアデザイン",
  "複雑系/複雑系情報学科",
  "知能システム/知能情報学科",
  "高度ICT",
];
export const GRADES = [
  "学部1年",
  "学部２年",
  "学部3年",
  "学部4年",
  "修士１",
  "修士２",
];
export const CLASSES = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
];

export const TERM_MAP: Record<string, string> = {
  前期: "H1",
  後期: "H2",
  通年: "AllYear",
  第1クォーター: "Q1",
  第2クォーター: "Q2",
  第3クォーター: "Q3",
  第4クォーター: "Q4",
  夏季集中: "SummerIntensive",
  冬季集中: "WinterIntensive",
};
export const REQUIRED_TYPE_MAP: Record<string, string> = {
  必修: "Required",
  選択: "Optional",
  必修選択: "OptionalRequired",
};
export const CATEGORY_MAP: Record<string, string> = {
  専門: "Specialized",
  教養: "Cultural",
  研究指導: "ResearchInstruction",
};
export const COURSE_MAP: Record<string, string> = {
  "情報システム/情報アーキテクチャ": "InformationSystem",
  "情報デザイン/メディアデザイン": "InformationDesign",
  "複雑系/複雑系情報学科": "ComplexSystem",
  "知能システム/知能情報学科": "IntelligentSystem",
  高度ICT: "AdvancedICT",
};
export const GRADE_MAP: Record<string, string> = {
  学部1年: "B1",
  学部２年: "B2",
  学部3年: "B3",
  学部4年: "B4",
  修士１: "M1",
  修士２: "M2",
};

export const SEMESTER_LABEL: Record<string, string> = {
  H1: "前期",
  H2: "後期",
  AllYear: "通年",
  Q1: "第1Q",
  Q2: "第2Q",
  Q3: "第3Q",
  Q4: "第4Q",
  SummerIntensive: "夏季集中",
  WinterIntensive: "冬季集中",
};

export const DAY_MAP: Record<string, string> = {
  Monday: "月",
  Tuesday: "火",
  Wednesday: "水",
  Thursday: "木",
  Friday: "金",
  Saturday: "土",
  Sunday: "日",
};

export const ALL_SEMESTERS = Object.values(TERM_MAP);

export function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}
