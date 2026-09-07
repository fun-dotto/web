"use client";

import { useState } from "react";
import { ChevronUpIcon } from "lucide-react";

export function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm rounded-lg border-2 transition-colors whitespace-nowrap ${
        selected
          ? "bg-accent-brand text-label-tertiary border-accent-brand"
          : "bg-background-secondary text-label-secondary border-border-primary hover:border-accent-brand"
      }`}
    >
      {label}
    </button>
  );
}

export function FilterGroup({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-label-secondary mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            selected={selected.has(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  );
}

export function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b-2 border-border-primary">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-base font-medium text-label-primary">
          {title}
        </span>
        <ChevronUpIcon
          className={`w-5 h-5 text-label-secondary transition-transform shrink-0 ${open ? "" : "rotate-180"}`}
        />
      </button>
      {open && <div className="pb-4 space-y-4">{children}</div>}
    </div>
  );
}
