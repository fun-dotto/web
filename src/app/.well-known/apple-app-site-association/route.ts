import dev from "@/config/apple-app-site-association/dev.json";
import prd from "@/config/apple-app-site-association/prd.json";
import stg from "@/config/apple-app-site-association/stg.json";
import { getDottoEnv } from "@/lib/env";

// 実行時の DOTTO_ENV で返す内容を切り替えるため、ビルド時に静的生成しない。
export const dynamic = "force-dynamic";

const associations = { dev, stg, prd };

export function GET() {
  return Response.json(associations[getDottoEnv()]);
}
