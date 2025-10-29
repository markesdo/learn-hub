'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-zinc-50 to-white">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.h1
            className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl"
            variants={fadeInUp}
          >
            Share and Discover{" "}
            <span className="text-zinc-600">Learning Resources</span>
          </motion.h1>
          <motion.p
            className="mt-6 text-lg leading-8 text-zinc-600"
            variants={fadeInUp}
          >
            A curated platform where students, teachers, and self-learners share quality learning materials.
            Find videos, articles, PDFs, and more — all in one place.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center"
            variants={fadeInUp}
          >
            <Link
              href="/resources"
              className="rounded-full bg-zinc-900 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Browse Resources
            </Link>
            <Link
              href="/submit"
              className="rounded-full border border-zinc-300 bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
            >
              Submit Resource
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Feature 1 */}
          <motion.div
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100">
              <svg
                className="h-6 w-6 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900">Easy Discovery</h3>
            <p className="text-sm text-zinc-600">
              Search and filter through curated learning resources by type, topic, and more.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100">
              <svg
                className="h-6 w-6 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900">Share Knowledge</h3>
            <p className="text-sm text-zinc-600">
              Contribute by sharing your favorite learning resources with the community.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100">
              <svg
                className="h-6 w-6 text-zinc-900"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900">Community-Driven</h3>
            <p className="text-sm text-zinc-600">
              Built by learners, for learners. Every resource is shared by someone in the community.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-2xl bg-zinc-900 px-6 py-16 text-center sm:px-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.h2
            className="text-3xl font-bold text-white sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-zinc-200"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join our community and start discovering quality learning resources today.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/login"
              className="inline-block rounded-full bg-white px-8 py-3 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
            >
              Sign Up Now
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
