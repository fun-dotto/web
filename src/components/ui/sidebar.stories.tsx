import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Bell, BookOpen, Home } from "lucide-react";

import { TooltipProvider } from "./tooltip";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from "./sidebar";

const meta = {
  title: "UI/Sidebar",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  { label: "ホーム", icon: Home, active: true },
  { label: "お知らせ", icon: Bell, active: false },
  { label: "科目", icon: BookOpen, active: false },
];

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar collapsible="icon">
          <SidebarHeader className="font-bold">Dotto</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>メニュー</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map(({ label, icon: Icon, active }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton isActive={active} tooltip={label}>
                        <Icon /><span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>user@example.com</SidebarFooter>
        </Sidebar>
        <SidebarInset className="min-h-svh p-4">
          <SidebarTrigger />
          <div className="grid flex-1 place-items-center text-muted-foreground">メインコンテンツ</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  ),
};
