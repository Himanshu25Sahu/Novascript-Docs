"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Cpu, ShieldCheck, Gauge, ArrowRight } from "lucide-react"

import Playground from "@/components/Playground"
import data from "@/app/data/examples.json"

// The snippets are the same programs the examples page ships, so every one of
// them is checked against the real interpreter on each build by
// `npm run gen:examples`. A snippet cannot rot without failing that first.
const SNIPPETS = data.examples.map((e) => ({
  id: e.id,
  title: e.title,
  source: e.source,
  expectFailure: e.expectFailure,
}))

const FACTS = [
  {
    Icon: Cpu,
    title: "The same interpreter",
    body: "Not a re-implementation in JavaScript. The C++ in the repository, compiled to WebAssembly with Emscripten — verified to produce output identical to the native binary on every bundled example.",
  },
  {
    Icon: ShieldCheck,
    title: "It cannot hang your tab",
    body: "The interpreter counts the statements it executes and stops itself past a budget, returning whatever your program printed first. Everything runs in a worker the page can kill outright.",
  },
  {
    Icon: Gauge,
    title: "Nothing loads until you run",
    body: "The 227 KB module is fetched the first time you press Run, not when the page opens. Every other page on this site ships none of it.",
  },
]

export default function PlaygroundPage() {
  const { stats } = data

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-3xl"
        >
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Playground
          </h1>
          <p className="text-lg leading-relaxed text-gray-300">
            {stats?.linesOfCpp?.toLocaleString() ?? "3,000"} lines of C++ — lexer, recursive-descent
            parser, scope-chained symbol table, semantic analyser and tree-walking interpreter —
            compiled to WebAssembly and running in this tab. Edit the program and watch every stage
            respond.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Playground snippets={SNIPPETS} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {FACTS.map(({ Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-gray-800 bg-gray-950/60 p-5">
              <Icon className="mb-3 h-5 w-5 text-blue-400" />
              <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-gray-400">{body}</p>
            </div>
          ))}
        </motion.div>

        {/* Say plainly what it will not do, so nobody has to find out by typing it. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 rounded-lg border border-amber-800/40 bg-amber-950/10 p-5"
        >
          <h3 className="mb-2 text-sm font-semibold text-amber-300">Where it stops</h3>
          <p className="max-w-3xl text-xs leading-relaxed text-gray-400">
            This is a student language, and the playground shows it honestly. List and dictionary
            literals lex, parse and type-check — you can watch the analyser infer{" "}
            <span className="font-mono text-gray-300">LIST</span> and{" "}
            <span className="font-mono text-gray-300">DICT</span> in the Symbols tab — but the
            interpreter has no case for them yet, so running one reports an unknown expression.
            Recursion, string concatenation and floats are likewise unimplemented. The{" "}
            <Link href="/examples" className="text-blue-400 underline-offset-2 hover:underline">
              examples page
            </Link>{" "}
            lists exactly what each stage supports.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-col items-start justify-between gap-4 rounded-lg border border-blue-800/40 bg-blue-950/20 p-8 sm:flex-row sm:items-center"
        >
          <div>
            <h3 className="mb-1 text-xl font-semibold text-blue-300">How each stage works</h3>
            <p className="text-sm text-gray-400">
              INDENT tokens, recursive descent, type inference.
            </p>
          </div>
          <Link
            href="/phases"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Explore the phases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
