"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  {
    href: "/tasks",
    label: "Tasks",
    icon: LayoutGrid,
    activeColor: "bg-blue-600",
    idleColor: "bg-blue-100",
  },
  {
    href: "/annotate",
    label: "Annotate",
    icon: ImageIcon,
    activeColor: "bg-amber-600",
    idleColor: "bg-amber-100",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-1 border-r bg-muted/30 p-3">
      <p className="px-2 py-3 text-sm font-semibold">Kanban Board</p>
      {NAV.map(({ href, label, icon: Icon, activeColor, idleColor }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
              active
                ? cn(activeColor, "text-white")
                : cn(idleColor, "text-foreground hover:opacity-80"),
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </aside>
  );
}
