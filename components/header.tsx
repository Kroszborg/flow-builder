"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Plus } from "lucide-react";

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
                  <Plus className="w-4 h-4 mr-2" />
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
