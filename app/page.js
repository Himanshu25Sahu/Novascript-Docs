"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Github, BookOpen, Layers } from "lucide-react"

import PipelineExplorer from "@/components/PipelineExplorer"
import data from "@/app/data/examples.json"

const FEATURED = ["primes", "factorial", "try-catch", "type-error"]

export default function HomePage() {
  const { examples, generatedAt, stats } = data
  const featured = FEATURED.map((id) => examples.find((e) => e.id === id)).filter(Boolean)

  const metrics = [
    { value: stats?.linesOfCpp?.toLocaleString() ?? "3,000+", label: "lines of C++" },
    { value: stats?.tokenTypes ?? 68, label: "token types" },
    { value: stats?.astNodeTypes ?? 24, label: "AST node types" },
    { value: 4, label: "pipeline stages" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-[11px] font-medium tracking-wide text-gray-400"
            >
              <Layers className="h-3 w-3 text-blue-400" />
              Lexer → Parser → Semantic analyser → Tree-walking interpreter
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
            >
              NovaScript
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl"
            >
              An indentation-sensitive language and the interpreter that runs it, hand-written in
              C++. Everything below is real output from the compiled binary.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Link
                href="/examples"
                className="glow-button group flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                All {examples.length} examples
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/phases"
                className="glow-button flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
              >
                <BookOpen className="h-4 w-4" />
                How it works
              </Link>
              <a
                href="https://github.com/Himanshu25Sahu/Novascript"
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
              >
                <Github className="h-4 w-4" />
                Source
              </a>
            </motion.div>
          </div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="grid grid-cols-2 gap-3"
          >
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-lg border border-gray-800 bg-gray-950/60 px-4 py-4"
              >
                <p className="font-mono text-2xl font-bold text-white">{metric.value}</p>
                <p className="mt-0.5 text-xs text-gray-500">{metric.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Live artifacts */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <PipelineExplorer examples={featured} generatedAt={generatedAt} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-6 text-center"
        >
          <Link
            href="/examples"
            className="inline-flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-blue-400"
          >
            All {examples.length} examples, including the two the compiler rejects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
