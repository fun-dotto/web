import { ChevronRightIcon, Plus, type LucideIcon } from "lucide-react";

type Props = {
  title: string;
  description1?: string;
  description2?: string;
  value?: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon | null;
  onTapped?: () => void;
  onLeadingIconTapped?: () => void;
};

export function ListItem({
  title,
  description1,
  description2,
  value,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon = ChevronRightIcon,
  onTapped,
  onLeadingIconTapped,
}: Props) {
  return (
    <div
      className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-border-primary hover:bg-background-primary transition-colors cursor-pointer"
      onClick={onTapped}
    >
      <div className="flex flex-row items-center gap-3">
        {LeadingIcon && (
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full ${onLeadingIconTapped && "hover:bg-background-secondary transition-colors cursor-pointer"}`}
            onClick={onLeadingIconTapped}
          >
            <LeadingIcon className="w-5 h-5 text-label-secondary" />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <p className="text-base font-medium text-label-primary">{title}</p>
          {description1 && (
            <p className="text-xs text-label-secondary">{description1}</p>
          )}
          {description2 && (
            <p className="text-xs text-label-secondary">{description2}</p>
          )}
        </div>
      </div>
      <div className="flex flex-row items-center gap-3">
        {value && <p className="text-xs text-label-secondary">{value}</p>}
        {TrailingIcon && (
          <div
            className="w-6 h-6 flex items-center justify-center"
            onClick={onLeadingIconTapped}
          >
            <TrailingIcon className="w-5 h-5 text-label-secondary" />
          </div>
        )}
      </div>
    </div>
  );
}
