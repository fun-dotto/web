import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Separator } from "./separator";
import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Feedback",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoadingSkeleton: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  ),
};

export const Separators: Story = {
  render: () => (
    <div className="flex h-20 items-center gap-4">
      <span>左</span><Separator orientation="vertical" /><span>右</span>
      <div className="w-40 space-y-3"><span>上</span><Separator /><span>下</span></div>
    </div>
  ),
};
