import type { Metadata } from "next";
import SubjectsSearchView from "@/components/subjects/SubjectsSearchView";

export const metadata: Metadata = {
  title: "科目検索",
  description: "科目を検索する",
};

export default function SubjectsPage() {
  return <SubjectsSearchView />;
}
