"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden gap-8 md:flex">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm transition-colors hover:text-ink",
            pathname === link.href ? "font-medium text-ink" : "text-ink-muted",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
