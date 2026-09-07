import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ListItem } from "./list-item";
import { Plus, User } from "lucide-react";

const meta = {
  title: "Dotto/ListItem",
  component: ListItem,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "認知科学1〜4",
    description1: "前期 木5　2単位",
    description2: "花田 光彦 他9名",
    value: "シラバスを見る",
    leadingIcon: Plus,
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};

export const WithoutValue: Story = {
  args: {
    title: "認知科学1〜4",
    description1: "前期 木5　2単位",
    description2: "花田 光彦 他9名",
    leadingIcon: Plus,
    onTapped: () => alert("タップされました"),
    onLeadingIconTapped: () => alert("アイコンがタップされました"),
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};

export const WithValue: Story = {
  args: {
    title: "学年",
    value: "学部1年",
    leadingIcon: User,
    onTapped: () => alert("タップされました"),
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};
