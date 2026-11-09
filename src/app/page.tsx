import {
  ArrowRightIcon,
  BellRingIcon,
  BusIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClipboardListIcon,
  GlobeIcon,
  MapIcon,
  SearchIcon,
  UtensilsIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DottoIcon from "@/assets/icon1024.png";
import screen1 from "@/assets/promo/screen-1.png";
import screen2 from "@/assets/promo/screen-2.png";
import screen3 from "@/assets/promo/screen-3.png";
import screen4 from "@/assets/promo/screen-4.png";
import screen5 from "@/assets/promo/screen-5.png";
import { DownloadButtons } from "@/components/promo/download-buttons";
import { Phone } from "@/components/promo/phone";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: {
    absolute: "Dotto - 公立はこだて未来大学ポータルアプリ",
  },
  description:
    "時間割・休講情報・バス・学食・マップ・科目検索。公立はこだて未来大学のキャンパスライフに必要な情報を、ひとつのアプリに。Dotto は 2023 年 12 月から運用されています。",
};

const overviewFeatures = [
  {
    icon: CalendarDaysIcon,
    title: "時間割",
    description: "1週間の授業を、日付つきでひと目で確認。",
  },
  {
    icon: BellRingIcon,
    title: "休講・補講・教室変更",
    description: "変更があった授業は色でわかる。見落としません。",
  },
  {
    icon: BusIcon,
    title: "バス時刻表",
    description: "出発までの残り時間を、いつでもすぐに。",
  },
  {
    icon: UtensilsIcon,
    title: "学食メニュー",
    description: "今日のメニューを価格・カロリーつきでチェック。",
  },
  {
    icon: MapIcon,
    title: "学内マップ",
    description: "フロアごとの地図で、教室も研究室も迷わない。",
  },
  {
    icon: SearchIcon,
    title: "科目検索",
    description: "学年・必修選択・学期で、履修したい科目を絞り込み。",
  },
];

const showcases = [
  {
    id: "timetable",
    label: "時間割・休講情報",
    title: "今日の授業と、休講・補講がひと目で。",
    description:
      "ホームを開けば、今週の時間割がすぐ見られます。休講や補講、教室変更は色分けで表示されるので、大学に着いてから気づく「え、休講だったの？」をなくせます。",
    points: [
      "月〜金の時間割を日付つきで表示",
      "休講は赤、補講はオレンジで一目瞭然",
      "休講・補講・教室変更の一覧もまとめて確認",
    ],
    image: screen1,
    alt: "Dotto の時間割画面。休講の授業が赤、補講の授業がオレンジで表示されている",
  },
  {
    id: "bus",
    label: "バス時刻表",
    title: "「次のバスまで、あと何分？」にすぐ答える。",
    description:
      "乗る停留所を選ぶだけ。出発時刻・到着時刻・出発までの残り時間が、大きな文字で見やすく並びます。平日ダイヤと土日ダイヤもワンタップで切り替え。",
    points: [
      "出発・到着時刻と残り時間を一覧表示",
      "平日 / 土日ダイヤをワンタップで切り替え",
      "よく使う停留所を覚えてくれる",
    ],
    image: screen2,
    alt: "Dotto のバス時刻表画面。亀田支所前から未来大までの便が出発時刻順に並んでいる",
  },
  {
    id: "map",
    label: "学内マップ",
    title: "広い校舎でも、もう迷わない。",
    description:
      "部屋名・教員名・メールアドレスで検索すると、場所がすぐに見つかります。授業で使用中の教室や、トイレ・給湯室の場所もマップ上で確認できます。",
    points: [
      "部屋名・教員名・メールアドレスで検索",
      "使用中の教室をマップ上で可視化",
      "トイレ・給湯室の位置もわかる",
    ],
    image: screen3,
    alt: "Dotto の学内マップ画面。3階のフロアマップで使用中の大講義室がオレンジで表示されている",
  },
  {
    id: "subject",
    label: "科目検索",
    title: "履修を決める時間を、もっと軽く。",
    description:
      "科目名での検索に加えて、学年・学期・必修/選択・コースなどの条件で絞り込めます。気になる科目は、時間割にそのまま登録。",
    points: [
      "学年・学期・必修選択・コースで絞り込み",
      "科目の詳細をその場で確認",
      "見つけた科目をそのまま時間割へ",
    ],
    image: screen4,
    alt: "Dotto の科目検索画面。学年や必修などのチェックボックスで条件を絞り込める",
  },
  {
    id: "funch",
    label: "学食メニュー",
    title: "お昼、なに食べよう？を、家を出る前に。",
    description:
      "セット・単品、丼・カレー、麺、副菜、デザート。カテゴリごとに今日のメニューを写真つきで確認できます。価格とカロリーも載っているので、お昼の相談にも。",
    points: [
      "写真つきで今日のメニューをチェック",
      "価格とカロリーがひと目でわかる",
      "日付を切り替えて別の日のメニューも",
    ],
    image: screen5,
    alt: "Dotto の学食メニュー画面。ホッケ塩焼きの写真と価格・カロリーが表示されている",
  },
];

const webFeatures = [
  "科目検索で、パソコンの大きな画面から履修計画",
  "休講・補講・教室変更をまとめてチェック",
  "Google アカウントでかんたんサインイン",
];

function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-2xl text-center", className)}>
      <p className="text-sm font-bold tracking-widest text-accent-brand">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold leading-tight text-label-primary sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-label-secondary">
          {description}
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="bg-background-primary text-label-primary">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-border-primary/70 bg-background-primary/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src={DottoIcon} alt="" width={28} height={28} />
            <span className="text-lg font-bold tracking-tight">Dotto</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#features"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-label-secondary transition-colors hover:text-accent-brand sm:block"
            >
              機能
            </a>
            <a
              href="#download"
              className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-label-secondary transition-colors hover:text-accent-brand sm:block"
            >
              ダウンロード
            </a>
            <Link
              href="/course"
              className="rounded-full bg-accent-brand px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-accent-brand/90"
            >
              Web 版を開く
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* ヒーロー */}
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_40rem_at_85%_-10%,rgba(153,0,0,0.16),transparent_60%),radial-gradient(40rem_30rem_at_0%_100%,rgba(153,0,0,0.08),transparent_60%)]"
          />
          <Image
            src={DottoIcon}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-24 -z-10 hidden w-96 opacity-[0.04] lg:block"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-20">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-accent-brand/20 bg-white/70 px-4 py-1.5 text-xs font-bold text-accent-brand shadow-sm sm:text-sm">
                <Image src={DottoIcon} alt="" width={18} height={18} />
                公立はこだて未来大学ポータルアプリ
              </p>
              <h1 className="mt-6 text-4xl font-black leading-[1.2] tracking-tight sm:text-5xl lg:text-6xl">
                未大生の毎日を、
                <br />
                <span className="text-accent-brand">これ一つ</span>で。
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-label-secondary sm:text-lg lg:mx-0">
                {
                  "時間割、休講情報、バス、学食、マップ、科目検索。キャンパスライフに必要な情報が、ひとつのアプリにそろいます。"
                }
              </p>
              <DownloadButtons className="mt-8 justify-center lg:justify-start" />
              <p className="mt-4 text-sm text-label-secondary">
                パソコンからは{" "}
                <Link
                  href="/course"
                  className="font-bold text-accent-brand underline-offset-4 hover:underline"
                >
                  Web 版
                </Link>{" "}
                も使えます
              </p>
            </div>

            <div className="relative mx-auto flex w-full max-w-md justify-center lg:max-w-none">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 -z-10 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-brand/20 blur-3xl sm:size-96"
              />
              <Phone
                src={screen4}
                alt=""
                className="absolute -left-2 top-10 w-[42%] -rotate-6 opacity-95 sm:left-4 sm:w-[40%]"
              />
              <Phone
                src={screen1}
                alt="Dotto の時間割画面"
                priority
                className="relative z-10 w-[58%] motion-safe:animate-float sm:w-[52%]"
              />
              <Phone
                src={screen5}
                alt=""
                className="absolute -right-2 top-14 w-[42%] rotate-6 opacity-95 sm:right-4 sm:w-[40%]"
              />
            </div>
          </div>
        </section>

        {/* 信頼ストリップ */}
        <section
          aria-label="Dotto について"
          className="border-y border-border-primary bg-background-secondary"
        >
          <dl className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-border-primary px-4 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
            {[
              ["2023.12〜", "運用開始から、学生の毎日とともに"],
              ["6 つの機能", "キャンパスライフの「困った」に、ひとつで"],
              ["iOS / Android / Web", "どのデバイスからでも"],
            ].map(([value, label]) => (
              <div key={value} className="px-4 py-6">
                <dt className="text-xl font-black text-accent-brand sm:text-2xl">
                  {value}
                </dt>
                <dd className="mt-1 text-sm text-label-secondary">{label}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 機能一覧 */}
        <section
          id="features"
          className="scroll-mt-14 px-4 py-20 sm:px-6 sm:py-28"
        >
          <SectionHeading
            eyebrow="FEATURES"
            title="大学生活に必要なものが、全部ここに。"
            description="授業の確認からお昼ごはんまで。アプリをいくつも行き来する必要はありません。"
          />
          <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {overviewFeatures.map((feature) => (
              <li
                key={feature.title}
                className="group rounded-3xl border border-border-primary bg-background-secondary p-6 transition-all duration-200 hover:-translate-y-1 hover:border-accent-brand/30 hover:shadow-xl hover:shadow-accent-brand/10"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-accent-brand/10 text-accent-brand transition-colors group-hover:bg-accent-brand group-hover:text-white">
                  <feature.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-label-secondary">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* 機能詳細 */}
        <section className="bg-background-secondary px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto flex max-w-6xl flex-col gap-24 sm:gap-32">
            {showcases.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <div
                  className={cn(
                    "mx-auto w-full max-w-[17rem] sm:max-w-xs",
                    index % 2 === 1 && "md:order-2",
                  )}
                >
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-0 top-1/4 -z-0 mx-auto h-1/2 w-3/4 rounded-full bg-accent-brand/15 blur-3xl"
                    />
                    <Phone
                      src={item.image}
                      alt={item.alt}
                      className="relative"
                    />
                  </div>
                </div>
                <div>
                  <p className="inline-block rounded-full bg-accent-brand/10 px-3 py-1 text-xs font-bold text-accent-brand">
                    {item.label}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold leading-snug sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-label-secondary">
                    {item.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {item.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-3 text-sm sm:text-base"
                      >
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-brand text-white">
                          <CheckIcon className="size-3.5" aria-hidden="true" />
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Web 版 */}
        <section className="px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 overflow-hidden rounded-[2rem] bg-background-tertiary p-8 text-white sm:p-12 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-bold tracking-widest text-white/70">
                <GlobeIcon className="size-4" aria-hidden="true" />
                WEB
              </p>
              <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
                パソコンの大きな画面でも、
                <br />
                Dotto を。
              </h2>
              <p className="mt-4 leading-relaxed text-white/75">
                ブラウザから使える Web
                版もあります。アプリをインストールしなくても、Google
                アカウントでサインインするだけ。
              </p>
              <Link
                href="/course"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-label-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30"
              >
                Web 版を開く
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <ul className="space-y-4">
              {webFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 p-4 text-sm leading-relaxed sm:text-base"
                >
                  <ClipboardListIcon
                    className="mt-0.5 size-5 shrink-0 text-white/70"
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 最終 CTA */}
        <section
          id="download"
          className="scroll-mt-14 bg-accent-brand px-4 py-20 text-center text-white sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-2xl">
            <Image
              src={DottoIcon}
              alt="Dotto"
              width={72}
              height={72}
              className="mx-auto rounded-2xl bg-white p-2 shadow-xl"
            />
            <h2 className="mt-6 text-balance text-3xl font-bold leading-tight sm:text-4xl">
              さあ、Dotto をはじめよう。
            </h2>
            <p className="mt-4 text-balance leading-relaxed text-white/80">
              今日から、キャンパスライフがちょっと軽くなります。
            </p>
            <DownloadButtons className="mt-8 justify-center" />
          </div>
        </section>
      </main>

      <footer className="bg-background-secondary px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-label-secondary sm:flex-row">
          <div className="flex items-center gap-2">
            <Image src={DottoIcon} alt="" width={22} height={22} />
            <span className="font-bold text-label-primary">Dotto</span>
            <span>&copy; 2026 Dotto運営事務局</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/terms" className="hover:underline">
              利用規約
            </Link>
            <Link href="/privacy" className="hover:underline">
              プライバシーポリシー
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
