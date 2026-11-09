import Link from "next/link";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export function LegalDocument({
  title,
  updatedAt,
  intro,
  sections,
}: {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 text-label-primary">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-sm text-label-secondary">
        最終更新日: {updatedAt}
      </p>
      <p className="mb-8 text-sm leading-relaxed">{intro}</p>
      <div className="flex flex-col gap-8">
        {sections.map((section, index) => (
          <section key={section.title}>
            <h2 className="mb-3 text-lg font-semibold">
              {index + 1}. {section.title}
            </h2>
            {section.paragraphs?.map((p) => (
              <p key={p} className="mb-2 text-sm leading-relaxed">
                {p}
              </p>
            ))}
            {section.items && (
              <ul className="list-disc space-y-1 pl-6 text-sm leading-relaxed">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      <nav className="mt-12 flex gap-4 border-t border-border-primary pt-6 text-sm text-label-secondary">
        <Link href="/privacy" className="hover:underline">
          プライバシーポリシー
        </Link>
        <Link href="/terms" className="hover:underline">
          利用規約
        </Link>
      </nav>
    </div>
  );
}
