import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-400 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                <span className="text-lg font-bold text-white">L</span>
              </div>
              <span className="text-xl font-semibold text-zinc-900">
                LearnHub
              </span>
            </div>
            <p className="text-sm text-zinc-600">
              Share and discover quality learning resources.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Browse Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/submit"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Submit Resource
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/imprint"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Imprint
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-zinc-600 transition-colors hover:text-zinc-900"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-zinc-400 pt-8">
          <p className="text-center text-sm text-zinc-600">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
