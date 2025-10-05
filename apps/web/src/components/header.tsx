"use client";
import Link from "next/link";
import { Card } from "./ui/card";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/ai", label: "AI Chat" },
  ] as const;

  return (
    <Card className="rounded-none border-x-0 border-t-0">
      <div className="flex w-full items-center justify-between px-4 py-3">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => (
            <Link href={to} key={to}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </Card>
  );
}
