import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ListItem } from "./list-item";

const meta = {
  title: "Dotto/ListItem",
  component: ListItem,
  parameters: { layout: "centered" },
} satisfies Meta<typeof ListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "情報工学概論",
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};

export const WithDescriptions: Story = {
  args: {
    title: "情報工学概論",
    descriptions: ["月曜1限", "工学部棟 101教室"],
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};

export const Clickable: Story = {
  args: {
    title: "情報工学概論",
    descriptions: ["月曜1限"],
    onClick: () => alert("クリックされました"),
  },
  render: (args) => (
    <div className="w-96">
      <ListItem {...args} />
    </div>
  ),
};
