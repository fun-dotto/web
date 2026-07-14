"use client";

import { ChevronRightIcon } from "lucide-react";

type Props = {
  title: string;
  descriptions?: string[];
  onClick?: () => void;
};

export function ListItem({ title, descriptions, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 border-b-2 border-border-primary text-left hover:bg-background-primary transition-colors"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <p className="text-base font-medium leading-normal text-label-primary">{title}</p>
        {descriptions?.map((desc, i) => (
          <p key={i} className="text-sm leading-[1.2] text-label-secondary">{desc}</p>
        ))}
      </div>
      <ChevronRightIcon className="w-5 h-5 text-label-secondary shrink-0 ml-2" />
    </button>
  );
}
