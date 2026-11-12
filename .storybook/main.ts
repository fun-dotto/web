import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
  stories: ["../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: {
    name: "@storybook/nextjs-vite",
    options: {},
  },
  staticDirs: ["../public"],
  viteFinal: async (viteConfig) => {
    viteConfig.build = {
      ...viteConfig.build,
      // Storybook のプレビュー(axe / docs 等)は本質的に大きいため警告閾値を引き上げる
      chunkSizeWarningLimit: 1500,
      rolldownOptions: {
        ...viteConfig.build?.rolldownOptions,
        onwarn(warning, defaultHandler) {
          // "use client" はバンドル時に不要(Storybook は SPA)なので無視する
          if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
          const prev = viteConfig.build?.rolldownOptions?.onwarn;
          if (prev) prev(warning, defaultHandler);
          else defaultHandler(warning);
        },
      },
    };
    return viteConfig;
  },
};

export default config;
