import { defineConfig } from "cf/config";

// Storybook の静的ビルド (storybook-static) だけをデプロイするため、
// entrypoint を持たない assets-only の構成にする。
// デプロイは `cf deploy ./storybook-static` / `cf previews deploy ./storybook-static`。
export default defineConfig({
  accountId: "7d5470511ab2e965d404ee16e47831c1",
  worker: {
    name: "dotto-web-storybook",
    compatibilityDate: "2026-11-09",
  },
});
