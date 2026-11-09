import { SmartphoneIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "./store-links";

const baseClass =
  "group inline-flex items-center gap-3 rounded-2xl px-5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-brand";

export function DownloadButtons({
  tone = "light",
  className,
}: {
  /** light: 明るい背景用 / dark: ブランドカラー背景用 */
  tone?: "light" | "dark";
  className?: string;
}) {
  const primary =
    tone === "light"
      ? "bg-label-primary text-white shadow-lg shadow-black/10 hover:shadow-xl"
      : "bg-white text-accent-brand shadow-lg shadow-black/20 hover:shadow-xl";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClass, primary)}
      >
        <SmartphoneIcon className="size-6 shrink-0" aria-hidden="true" />
        <span className="flex flex-col leading-tight">
          <span className="text-[11px] opacity-80">iPhone / iPad</span>
          <span className="text-base font-bold">App Store</span>
        </span>
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(baseClass, primary)}
      >
        <SmartphoneIcon className="size-6 shrink-0" aria-hidden="true" />
        <span className="flex flex-col leading-tight">
          <span className="text-[11px] opacity-80">Android</span>
          <span className="text-base font-bold">Google Play</span>
        </span>
      </a>
    </div>
  );
}
