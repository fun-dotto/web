import { BellIcon, BookOpenIcon, MonitorIcon, SearchIcon } from "lucide-react";

export const navSections = [
  {
    label: "講義",
    items: [
      { title: "科目検索", href: "/course/subjects", icon: SearchIcon },
      {
        title: "休講・補講・教室変更",
        href: "/course/notice",
        icon: BookOpenIcon,
      },
    ],
  },
  {
    label: "設定",
    items: [
      { title: "お知らせ", href: "/setting/announcements", icon: BellIcon },
    ],
  },
  {
    label: "その他",
    items: [{ title: "Mac サポート", href: "/mac", icon: MonitorIcon }],
  },
];

export function pageTitleForPathname(pathname: string): string | null {
  for (const section of navSections) {
    for (const item of section.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item.title;
      }
    }
  }
  return null;
}
