"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Terminal, GitBranch, AlertCircle, ArrowRight } from "lucide-react"

import PipelineExplorer from "@/components/PipelineExplorer"
import data from "@/app/data/examples.json"

const SUPPORT = [
  {
    heading: "Runs end to end",
    tone: "text-emerald-300",
    ring: "border-emerald-700/40",
    items: [
      "let / set, types inferred at declaration",
      "Integers and strings",
      "say (one expression)",
      "+  -  *  /  truncating integer division",
      "==  !=  <  <=  >  >=",
      "when / otherwise",
      "repeat while",
      "repeat for i from a to b step c",
      "define function / call / return",
      "try / catch",
      "# and /* */ comments",
      "Indentation-delimited blocks",
    ],
  },
  {
    heading: "Parses and type-checks, not yet executed",
    tone: "text-amber-300",
    ring: "border-amber-700/40",
    items: [
      "match / case dispatch",
      "repeat with i starting at a until b",
      "List and dictionary literals",
      "Index reads and index assignment",
      "throw",
    ],
  },
  {
    heading: "Not supported yet",
    tone: "text-gray-400",
    ring: "border-gray-700",
    items: [
      "Recursion (return type unknown mid-definition)",
      "String concatenation, multi-argument say",
      "Modulo",
      "Floats — literals truncate to integers",
      "increase x by n",
    ],
  },
]

export default function ExamplesPage() {
  const { examples, generatedAt, stats } = data

  const ran = examples.filter((e) => e.succeeded).length
  const totalTokens = examples.reduce((n, e) => n + e.tokenCount, 0)

  return (
    <div className="min-h-screen bg-gray-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 max-w-3xl"
        >
          <h1 className="mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            Code Examples
          </h1>
          <p className="text-lg leading-relaxed text-gray-300">
            {examples.length} programs run through the real interpreter — {ran} clean runs,{" "}
            {examples.length - ran} deliberate rejections, {totalTokens.toLocaleString()} tokens.
          </p>
        </motion.div>

        {/* Explorer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <PipelineExplorer examples={examples} generatedAt={generatedAt} />
        </motion.div>

        {/* How this page is built */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid gap-4 md:grid-cols-3"
        >
          {[
            {
              Icon: Terminal,
              title: "Captured, not written",
              body: "A script runs each .ns file through the binary and parses the real stdout into JSON.",
            },
            {
              Icon: GitBranch,
              title: "Fails when the language does",
              body: "Every example declares its expected result. If the interpreter disagrees, the build fails.",
            },
            {
              Icon: AlertCircle,
              title: "Rejections included",
              body: "Two programs are invalid on purpose — one dies in the parser, one in the analyser.",
            },
          ].map(({ Icon, title, body }) => (
            <div key={title} className="rounded-lg border border-gray-800 bg-gray-950/60 p-5">
              <Icon className="mb-3 h-5 w-5 text-blue-400" />
              <h3 className="mb-2 text-sm font-semibold text-white">{title}</h3>
              <p className="text-xs leading-relaxed text-gray-400">{body}</p>
            </div>
          ))}
        </motion.div>

        {/* Honest capability matrix */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16"
        >
          <h2 className="mb-2 text-2xl font-bold text-white">What the language actually does</h2>
          <p className="mb-6 max-w-2xl text-sm text-gray-400">
            {stats?.astNodeTypes ?? 24} AST node types exist; not all reach the interpreter yet.
            Every line below was verified by running it.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {SUPPORT.map((group) => (
              <div key={group.heading} className={`rounded-lg border bg-gray-950/60 p-5 ${group.ring}`}>
                <h3 className={`mb-4 text-sm font-semibold ${group.tone}`}>{group.heading}</h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-xs leading-relaxed text-gray-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
                      <span className="font-mono">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Next */}
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
