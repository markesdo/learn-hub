import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand - Takes up 5 columns */}
          <div className="space-y-6 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-700 via-zinc-600 to-zinc-500 shadow-lg">
                <BookOpen className="h-5 w-5 text-white" strokeWidth={2.5} />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">LearnHub</span>
                <span className="text-[10px] font-medium text-zinc-400 -mt-0.5">Knowledge Shared</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              A modern platform where students, teachers, and self-learners share
              and discover quality learning resources. Join our growing community today.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-all hover:bg-white hover:text-zinc-900"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-all hover:bg-white hover:text-zinc-900"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@learnhub.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 transition-all hover:bg-white hover:text-zinc-900"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns - Takes up 7 columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-7 sm:grid-cols-3">
            {/* Platform */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/resources"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Browse Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/submit"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Submit Resource
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/imprint"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Imprint
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-sm text-zinc-400 transition-colors hover:text-white hover:underline underline-offset-4"
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="mt-16 border-t border-zinc-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-400">
              © {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
            <p className="text-sm text-zinc-400">
              Made with <span className="text-red-400">♥</span> for learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
