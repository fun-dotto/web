import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>科目のお知らせ</CardTitle>
        <CardDescription>更新日時: 2026年7月14日</CardDescription>
        <CardAction><Button variant="ghost" size="sm">詳細</Button></CardAction>
      </CardHeader>
      <CardContent>授業に関する最新のお知らせを確認できます。</CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">閉じる</Button>
        <Button>確認する</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="w-80">
      <CardHeader><CardTitle>コンパクトカード</CardTitle></CardHeader>
      <CardContent>少ない情報をまとめる表示です。</CardContent>
    </Card>
  ),
};
