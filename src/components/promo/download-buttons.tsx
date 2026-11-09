import Image from "next/image";
import appStoreBadge from "@/assets/promo/badges/app-store-ja.svg";
import googlePlayBadge from "@/assets/promo/badges/google-play-ja.png";
import { cn } from "@/lib/utils";
import { APP_STORE_URL, GOOGLE_PLAY_URL } from "./store-links";

const linkClass =
  "block rounded-xl transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-brand";

/**
 * 公式のストアバッジ(App Store / Google Play)を並べる。
 * バッジは各社のブランドガイドラインに従い、画像を加工せずそのまま表示する。
 */
export function DownloadButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-4", className)}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        <Image
          src={appStoreBadge}
          alt="App Store からダウンロード"
          unoptimized
          className="h-14 w-auto"
        />
      </a>
      <a
        href={GOOGLE_PLAY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        {/* 公式 PNG は上下に余白を含むため、見た目の高さを App Store と揃える */}
        <Image
          src={googlePlayBadge}
          alt="Google Play で手に入れよう"
          className="-my-[9px] h-[75px] w-auto"
        />
      </a>
    </div>
  );
}
