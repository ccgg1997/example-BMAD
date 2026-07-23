import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomTabBar } from "@/components/bottom-tab-bar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background sm:my-6 sm:min-h-[calc(100vh-3rem)] sm:overflow-hidden sm:rounded-2xl sm:border sm:shadow-sm">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 px-4 pb-4">{children}</main>
      <BottomTabBar />
    </div>
  );
}
