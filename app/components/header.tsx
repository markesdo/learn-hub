import Link from "next/link";
import { getUser } from "@/app/actions/auth";
import { UserMenu } from "./auth/user-menu";

export async function Header() {
  const user = await getUser();

  return (
    <header className="border-b border-zinc-400 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <span className="text-xl font-semibold text-zinc-900">LearnHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/resources"
              className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
            >
              Resources
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/submit"
                  className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900"
                >
                  Submit
                </Link>
              </>
            )}
          </nav>

          {/* Auth Button or User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserMenu username={user.username} email={user.email} />
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
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

