import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div aria-live="polite" aria-busy="true">
      <div className="bg-background-tertiary -mx-6 -mt-6 px-6 pt-6 pb-8 mb-8">
        <Skeleton className="h-3 w-20 mb-6" />
        <Skeleton className="h-10 w-full max-w-[32rem] mb-4" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-5 w-full max-w-[44rem]" />
        <Skeleton className="h-5 w-full max-w-[42rem]" />
        <Skeleton className="h-5 w-full max-w-[38rem]" />
        <Skeleton className="h-5 w-full max-w-[40rem]" />
        <Skeleton className="h-5 w-full max-w-[36rem]" />
        <Skeleton className="h-5 w-full max-w-[41rem]" />
        <Skeleton className="h-5 w-full max-w-[34rem]" />
        <Skeleton className="h-5 w-full max-w-[39rem]" />
      </div>
    </div>
  );
}
