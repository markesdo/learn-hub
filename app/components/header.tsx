import Link from "next/link";
import Image from "next/image";
import { getUser } from "@/app/actions/auth";
import { UserMenu } from "./auth/user-menu";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const user = await getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <Image
              src="/learnhub_logo.png"
              alt="LearnHub - Knowledge Shared"
              width={400}
              height={100}
              className="h-20 w-auto transition-transform group-hover:scale-105"
              priority
            />
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

