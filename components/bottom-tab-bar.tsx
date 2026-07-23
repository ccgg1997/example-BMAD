"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText } from "lucide-react";

const TABS = [
  { href: "/registro", label: "Registro", Icon: FileText },
  { href: "/resumen", label: "Resumen", Icon: BarChart3 },
] as const;

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex border-t bg-background">
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium ${
              active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Icon className="size-5" />
            {label}
            <span
              className={`mt-0.5 h-0.5 w-8 rounded-full ${active ? "bg-primary" : "bg-transparent"}`}
            />
          </Link>
        );
      })}
    </nav>
  );
}
