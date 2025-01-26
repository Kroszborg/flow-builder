"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Flow Builder
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/new">
                <Button variant={pathname === "/new" ? "default" : "ghost"}>
                  New Flow
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/flows">
                <Button variant={pathname === "/flows" ? "default" : "ghost"}>
                  My Flows
                </Button>
              </Link>
            </li>
            <li>
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
