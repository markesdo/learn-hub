'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderNavProps {
  isAuthenticated: boolean;
}

export function HeaderNav({ isAuthenticated }: HeaderNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/resources') {
      return pathname === '/resources';
    }
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    if (path === '/submit') {
      return pathname === '/submit';
    }
    return false;
  };

  return (
    <nav className="hidden items-center gap-2 md:flex">
      <Link
        href="/resources"
        className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
          isActive('/resources')
            ? 'bg-zinc-900 text-white shadow-sm'
            : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
        }`}
      >
        Resources
      </Link>
      {isAuthenticated && (
        <>
          <Link
            href="/dashboard"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive('/dashboard')
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/submit"
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              isActive('/submit')
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900'
            }`}
          >
            Submit Resource
          </Link>
        </>
      )}
    </nav>
  );
}
