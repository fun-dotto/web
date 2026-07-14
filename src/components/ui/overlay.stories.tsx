import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "./button";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const meta = {
  title: "UI/Overlay",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const TooltipExample: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline" />}>ホバーしてください</TooltipTrigger>
        <TooltipContent>補足情報を表示します</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const SheetExample: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button />}>シートを開く</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>表示設定</SheetTitle>
          <SheetDescription>表示方法をカスタマイズできます。</SheetDescription>
        </SheetHeader>
        <div className="px-4 text-sm">シートのコンテンツ</div>
        <SheetFooter><Button>保存</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
