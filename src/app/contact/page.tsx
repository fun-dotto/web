import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "Dotto へのお問い合わせ",
};

const FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdo87UgmLJCvbskhz835qQvoSpS8Rf_diDepvu4t7nFhnh9fw/viewform?embedded=true";

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-label-primary">
      <h1 className="mb-6 text-2xl font-bold">お問い合わせ</h1>
      <div className="flex items-center justify-center">
        <iframe
          src={FORM_URL}
          title="お問い合わせフォーム"
          width={640}
          height={700}
          className="w-full max-w-160 border-0"
        >
          読み込んでいます…
        </iframe>
      </div>
    </div>
  );
}
