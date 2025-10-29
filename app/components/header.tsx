import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import { UserMenu } from "./auth/user-menu";
import { BookOpen } from "lucide-react";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-700 shadow-lg transition-transform group-hover:scale-105">
              <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-zinc-900">LearnHub</span>
              <span className="text-[10px] font-medium text-zinc-500 -mt-0.5">Knowledge Shared</span>
            </div>
          </Link>

          {/* Navigation */}
          <HeaderNav isAuthenticated={!!user} />

          {/* Auth Button or User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu username={user.username} email={user.email} />
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-zinc-800 hover:shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

