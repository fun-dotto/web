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
  const context = useContext(PageHeaderTitleContext);
  if (!context) {
    throw new Error(
      "PageHeaderTitle must be used within a PageHeaderTitleProvider",
    );
  }
  const { setTitle } = context;

  useEffect(() => {
    setTitle(title);
    return () => setTitle(null);
  }, [title, setTitle]);

  return null;
}

export function PageHeaderActions({
  children,
}: {
  children: React.ReactNode;
}) {
  const context = useContext(PageHeaderTitleContext);
  if (!context) {
    throw new Error(
      "PageHeaderActions must be used within a PageHeaderTitleProvider",
    );
  }
  const { setActions } = context;

  useEffect(() => {
    setActions(children);
    return () => setActions(null);
  }, [children, setActions]);

  return null;
}
