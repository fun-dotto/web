import { ChevronRightIcon, Plus, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  title: string;
  description1?: string;
  description2?: string;
  value?: string;
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon | null;
  onTapped?: () => void;
  onLeadingIconTapped?: () => void;
  isLoading?: boolean;
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
  isLoading = false,
}: Props) {
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-between gap-3 px-4 py-3 border-b border-border-primary">
        <div className="flex flex-row items-center gap-3">
          {LeadingIcon && <Skeleton className="w-6 h-6 rounded-full" />}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-32" />
            {description1 && <Skeleton className="h-3 w-24" />}
            {description2 && <Skeleton className="h-3 w-20" />}
          </div>
        </div>
        <div className="flex flex-row items-center gap-3">
          {value && <Skeleton className="h-3 w-8" />}
          {TrailingIcon && <Skeleton className="w-5 h-5" />}
        </div>
      </div>
    );
  }

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
