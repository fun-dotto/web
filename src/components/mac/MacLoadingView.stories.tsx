import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MacLoadingView } from "./MacLoadingView";

const meta = {
  title: "Mac/LoadingView",
  component: MacLoadingView,
  parameters: { layout: "fullscreen" },
  decorators: [(Story) => <main className="min-h-svh bg-background-primary p-6"><Story /></main>],
} satisfies Meta<typeof MacLoadingView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const List: Story = { args: { mode: "list" } };
export const Detail: Story = { args: { mode: "detail" } };
