"use client";

import { createContext, useContext, useEffect, useState } from "react";

const PageHeaderTitleContext = createContext<{
  title: string | null;
  setTitle: (title: string | null) => void;
  actions: React.ReactNode | null;
  setActions: (actions: React.ReactNode | null) => void;
} | null>(null);

export function PageHeaderTitleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState<string | null>(null);
  const [actions, setActions] = useState<React.ReactNode | null>(null);

  return (
    <PageHeaderTitleContext.Provider
      value={{ title, setTitle, actions, setActions }}
    >
      {children}
    </PageHeaderTitleContext.Provider>
  );
}

export function usePageHeaderTitle(): string | null {
  const context = useContext(PageHeaderTitleContext);
  if (!context) {
    throw new Error(
      "usePageHeaderTitle must be used within a PageHeaderTitleProvider",
    );
  }
  return context.title;
}

export function usePageHeaderActions(): React.ReactNode | null {
  const context = useContext(PageHeaderTitleContext);
  if (!context) {
    throw new Error(
      "usePageHeaderActions must be used within a PageHeaderTitleProvider",
    );
  }
  return context.actions;
}

export function PageHeaderTitle({ title }: { title: string }) {
  // 未ログイン時など、ヘッダーが無いレイアウトでは Provider が存在しないので何もしない。
  const context = useContext(PageHeaderTitleContext);
  const setTitle = context?.setTitle;

  useEffect(() => {
    if (!setTitle) return;
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);

  return null;
}

export function PageHeaderActions({ children }: { children: React.ReactNode }) {
  // 未ログイン時など、ヘッダーが無いレイアウトでは Provider が存在しないので何もしない。
  const context = useContext(PageHeaderTitleContext);
  const setActions = context?.setActions;

  useEffect(() => {
    if (!setActions) return;
    setActions(children);
    return () => setActions(null);
  }, [children, setActions]);

  return null;
}
