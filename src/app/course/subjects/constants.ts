import { Class, Course, Grade } from "@/api/app/v1/common_pb";
import {
  SubjectClassification,
  SubjectRequirementType,
  SubjectSemester,
} from "@/api/app/v1/subject_pb";
import { DayOfWeek } from "@/api/google/type/dayofweek_pb";

/** 検索結果の一覧に表示する科目。Client Component に渡すためプレーンな値のみを持つ。 */
export type Subject = {
  id: string;
  name: string;
  semester: SubjectSemester;
  credit: number;
  faculties: { faculty: { name: string }; isPrimary: boolean }[];
};

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

export const SEMESTER_LABEL: Partial<Record<SubjectSemester, string>> = {
  [SubjectSemester.H1]: "前期",
  [SubjectSemester.H2]: "後期",
  [SubjectSemester.ALL_YEAR]: "通年",
  [SubjectSemester.Q1]: "第1Q",
  [SubjectSemester.Q2]: "第2Q",
  [SubjectSemester.Q3]: "第3Q",
  [SubjectSemester.Q4]: "第4Q",
  [SubjectSemester.SUMMER_INTENSIVE]: "夏季集中",
  [SubjectSemester.WINTER_INTENSIVE]: "冬季集中",
};

export const DAY_MAP: Partial<Record<DayOfWeek, string>> = {
  [DayOfWeek.MONDAY]: "月",
  [DayOfWeek.TUESDAY]: "火",
  [DayOfWeek.WEDNESDAY]: "水",
  [DayOfWeek.THURSDAY]: "木",
  [DayOfWeek.FRIDAY]: "金",
  [DayOfWeek.SATURDAY]: "土",
  [DayOfWeek.SUNDAY]: "日",
};

// URL のクエリパラメータの値と Proto の enum の対応
export const SEMESTER_ENUM: Record<string, SubjectSemester> = {
  H1: SubjectSemester.H1,
  H2: SubjectSemester.H2,
  AllYear: SubjectSemester.ALL_YEAR,
  Q1: SubjectSemester.Q1,
  Q2: SubjectSemester.Q2,
  Q3: SubjectSemester.Q3,
  Q4: SubjectSemester.Q4,
  SummerIntensive: SubjectSemester.SUMMER_INTENSIVE,
  WinterIntensive: SubjectSemester.WINTER_INTENSIVE,
};
export const REQUIREMENT_TYPE_ENUM: Record<string, SubjectRequirementType> = {
  Required: SubjectRequirementType.REQUIRED,
  Optional: SubjectRequirementType.OPTIONAL,
  OptionalRequired: SubjectRequirementType.OPTIONAL_REQUIRED,
};
export const CLASSIFICATION_ENUM: Record<string, SubjectClassification> = {
  Specialized: SubjectClassification.SPECIALIZED,
  Cultural: SubjectClassification.CULTURAL,
  ResearchInstruction: SubjectClassification.RESEARCH_INSTRUCTION,
};
export const COURSE_ENUM: Record<string, Course> = {
  InformationSystem: Course.INFORMATION_SYSTEM,
  InformationDesign: Course.INFORMATION_DESIGN,
  ComplexSystem: Course.COMPLEX_SYSTEM,
  IntelligentSystem: Course.INTELLIGENT_SYSTEM,
  AdvancedICT: Course.ADVANCED_ICT,
};
export const GRADE_ENUM: Record<string, Grade> = {
  B1: Grade.B1,
  B2: Grade.B2,
  B3: Grade.B3,
  B4: Grade.B4,
  M1: Grade.M1,
  M2: Grade.M2,
};
export const CLASS_ENUM: Record<string, Class> = Object.fromEntries(
  CLASSES.map((c) => [c, Class[c as keyof typeof Class]]),
);

export const ALL_SEMESTERS = Object.values(SEMESTER_ENUM);

export function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}
