import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: { layout: "centered" },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
  args: { placeholder: "キーワードを入力" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "Storybook" } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "入力エラー" } };
export const Disabled: Story = { args: { disabled: true, defaultValue: "編集できません" } };
