import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/utils";

/**
 * 端末フレーム付きのスクリーンショットを表示する。
 * 画像自体にフレームが含まれているため、影だけを付ける。
 */
export function Phone({
  src,
  alt,
  className,
  priority = false,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      priority={priority}
      sizes="(min-width: 768px) 320px, 70vw"
      className={cn(
        "h-auto w-full drop-shadow-[0_30px_45px_rgba(60,55,60,0.28)]",
        className,
      )}
    />
  );
}
