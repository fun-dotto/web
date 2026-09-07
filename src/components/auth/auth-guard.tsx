"use client";

import { useAuth } from "@/contexts/auth-context";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { pageTitleForPathname } from "@/components/layout/nav-sections";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import {
  PageHeaderTitleProvider,
  usePageHeaderActions,
  usePageHeaderTitle,
} from "@/contexts/page-header-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

function PageHeader({ pathname }: { pathname: string }) {
  const overrideTitle = usePageHeaderTitle();
  const actions = usePageHeaderActions();
  const pageTitle = overrideTitle ?? pageTitleForPathname(pathname);

  return (
    <header className="flex h-12 items-center gap-3 px-4 border-b border-border-primary">
      <SidebarTrigger />
      {pageTitle && (
        <h1 className="text-sm font-semibold text-label-primary">
          {pageTitle}
        </h1>
      )}
      {actions && <div className="ml-auto flex items-center">{actions}</div>}
    </header>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-primary">
        <div className="h-8 w-8 rounded-full border-2 border-border-primary border-t-label-primary animate-spin" />
      </div>
    );
  }

  if (!user && pathname !== "/login") {
    return null;
  }

  if (!user) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <PageHeaderTitleProvider>
        <AppSidebar />
        <SidebarInset>
          <PageHeader pathname={pathname} />
          <main className="flex-1 p-6 bg-background-primary">{children}</main>
        </SidebarInset>
      </PageHeaderTitleProvider>
    </SidebarProvider>
  );
}
