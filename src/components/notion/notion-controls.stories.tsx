import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CopyCodeButton } from "./CopyCodeButton";
import { CopyableHeading } from "./CopyableHeading";
import { CopyMarkdownButton } from "./CopyMarkdownButton";

const meta = {
  title: "Notion/Controls",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const CopyMarkdown: Story = {
  render: () => <CopyMarkdownButton markdown="# サンプル\n\n本文です。" />,
};

export const CopyCode: Story = {
  render: () => (
    <div className="group relative rounded-lg bg-background-tertiary p-6 pr-32 text-label-tertiary">
      <code>pnpm storybook</code>
      <CopyCodeButton code="pnpm storybook" />
    </div>
  ),
};

export const Headings: Story = {
  render: () => (
    <div className="w-[36rem]">
      <CopyableHeading blockId="heading-1" level={1}>見出しレベル1</CopyableHeading>
      <CopyableHeading blockId="heading-2" level={2}>見出しレベル2</CopyableHeading>
      <CopyableHeading blockId="heading-3" level={3}>見出しレベル3</CopyableHeading>
    </div>
  ),
};
