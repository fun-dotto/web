import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "科目詳細",
};

type DetailRow = {
  label: string;
  value: string | null | undefined;
};

function DetailSection({ label, value }: DetailRow) {
  if (!value) return null;
  return (
    <div className="border-b-2 border-border-primary py-3 flex flex-col gap-2">
      <p className="font-medium text-xl text-label-primary">{label}</p>
      <p className="text-base text-label-secondary leading-normal tracking-[0.48px] whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await api.GET("/v1/subjects/{id}", {
    params: { path: { id } },
  });

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-accent-error text-sm">情報の取得に失敗しました。</p>
      </div>
    );
  }

  const { name, syllabus } = data.subject;

  const rows: DetailRow[] = [
    { label: "概要", value: syllabus.summary },
    { label: "到達目標", value: syllabus.learningOutcomes },
    { label: "提出課題等", value: syllabus.assignments },
    { label: "評価方法・基準", value: syllabus.evaluationMethod },
    { label: "テキスト", value: syllabus.textbooks },
    { label: "参考書", value: syllabus.referenceBooks },
    { label: "履修条件", value: syllabus.prerequisites },
    { label: "事前学習", value: syllabus.preLearning },
    { label: "事後学習", value: syllabus.postLearning },
    { label: "履修上の留意点", value: syllabus.notes },
    { label: "キーワード", value: syllabus.keywords },
    { label: "対象コース・領域", value: syllabus.targetCourses },
    { label: "対象領域", value: syllabus.targetAreas },
    { label: "科目群・科目区分", value: syllabus.classifications },
    { label: "教授言語", value: syllabus.teachingLanguage },
    { label: "授業内容とスケジュール", value: syllabus.contentsAndSchedule },
    { label: "授業・試験の形式", value: syllabus.teachingAndExamForm },
    { label: "DSOP対象科目", value: syllabus.dsopSubject },
  ];

  return (
    <div>
      {/* ヘッダー */}
      <div className="flex items-center gap-4 py-3 border-b-2 border-border-primary">
        <Link href="/subjects" className="text-label-secondary hover:text-label-primary transition-colors">
          <ChevronLeftIcon className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-medium text-accent-brand">{name}</h1>
      </div>

      {/* 詳細リスト */}
      <div className="flex justify-center p-[10px]">
        <div className="flex-1 max-w-[836px]">
          {rows.map((row) => (
            <DetailSection key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
