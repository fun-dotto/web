import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { ARTICLES_CACHE_TAG } from "@/lib/microcms";

/**
 * microCMS の Webhook から呼ばれ、記事のキャッシュを破棄する。
 * Webhook のカスタムヘッダー X-Revalidate-Secret に MICROCMS_WEBHOOK_SECRET を設定する。
 */
export async function POST(request: Request) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET;
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (
    !secret ||
    given.length !== secret.length ||
    !timingSafeEqual(Buffer.from(given), Buffer.from(secret))
  ) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(ARTICLES_CACHE_TAG, "max");
  revalidatePath("/articles");
  revalidatePath("/articles/[id]", "page");
  revalidatePath("/sitemap.xml");
  return Response.json({ revalidated: true });
}
