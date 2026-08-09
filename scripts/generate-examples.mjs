#!/usr/bin/env node
/**
 * Runs every program in ./examples through the real NovaScript interpreter
 * and records exactly what it printed into app/data/examples.json.
 *
 * Nothing on the site is hand-written: if the interpreter changes, re-run this
 * and the pages change with it.
 *
 *   npm run gen:examples
 *
 * The interpreter binary is located via, in order:
 *   1. the NOVASCRIPT_BIN environment variable
 *   2. a sibling ../Novascript/src/main.exe checkout
 *   3. the hard-coded fallback below
 *
 * main.exe always reads a file called `code.ns` from its working directory, so
 * each example is staged into a temp dir and the binary is run with that dir as
 * cwd. The interpreter itself is never modified.
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Shared with the browser playground, which runs the same interpreter compiled
// to WebAssembly and therefore produces the same text to parse.
import { normalise, parseRun } from "../lib/parseRun.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, "..")
const EXAMPLES_DIR = path.join(ROOT, "examples")
const OUT_FILE = path.join(ROOT, "app", "data", "examples.json")

const FALLBACK_BIN =
  "d:/Novascript 2.0/Novascript-700cfb0ad06b321dc42adcb97f929084a40279cb/src/main.exe"

/**
 * Display metadata. `file` must exist in examples/.
 * `expectFailure` marks the programs that are meant to be rejected — it is only
 * used to decide whether a non-zero result is a bug or the point of the demo.
 */
const MANIFEST = [
  {
    file: "factorial.ns",
    title: "Factorial",
    category: "Functions",
    description: "A function with a local accumulator, a while loop and a return value.",
    highlight: "Two scopes in the symbol table: the globals, and factorial's locals.",
  },
  {
    file: "fibonacci.ns",
    title: "Fibonacci",
    category: "Functions",
    description: "Ten Fibonacci numbers from an iterative three-variable swap.",
    highlight: "A void function — note the NONE return type inferred in the symbol table.",
  },
  {
    file: "primes.ns",
    title: "Prime Sieve",
    category: "Algorithms",
    description: "Every prime below 20, using integer division in place of modulo.",
    highlight: "A function called from inside a for-loop, with a nested while and a conditional.",
  },
  {
    file: "nested-loops.ns",
    title: "Nested Loops",
    category: "Control flow",
    description: "The 3x3 multiplication table from two stacked for-loops.",
    highlight: "Each loop header opens and closes its own lexical scope.",
  },
  {
    file: "countdown.ns",
    title: "Negative Step",
    category: "Control flow",
    description: "A for-loop counting downwards with an explicit negative step.",
    highlight: "`step` is an optional clause on the for-loop grammar.",
  },
  {
    file: "voting-age.ns",
    title: "Branching",
    category: "Control flow",
    description: "when / otherwise — NovaScript's if / else.",
    highlight: "The AST keeps the branches as a list of guarded bodies.",
  },
  {
    file: "match.ns",
    title: "Pattern Matching",
    category: "Control flow",
    description: "match / case dispatches on a value, inside a reusable function.",
    highlight: "The subject is evaluated once; each case body opens its own scope.",
  },
  {
    file: "try-catch.ns",
    title: "Exception Handling",
    category: "Errors",
    description: "A division by zero is raised at runtime and caught by name.",
    highlight: "The catch variable is bound as a STRING in a fresh scope.",
  },
  {
    file: "type-error.ns",
    title: "Type Mismatch",
    category: "Errors",
    description: "Rejected: a variable inferred as INTEGER cannot be reassigned a STRING.",
    expectFailure: true,
    highlight: "Lexing and parsing both succeed — the program dies in stage three.",
  },
  {
    file: "undeclared.ns",
    title: "Undeclared Variable",
    category: "Errors",
    description: "Rejected in the parser: names resolve against the symbol table as the AST is built.",
    expectFailure: true,
    highlight: "No AST is ever produced — the failure happens in stage two.",
  },
]

function resolveInterpreter() {
  const candidates = [
    process.env.NOVASCRIPT_BIN,
    path.resolve(ROOT, "..", "Novascript", "src", "main.exe"),
    FALLBACK_BIN,
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate
  }

  console.error("Could not find the NovaScript interpreter. Tried:")
  candidates.forEach((c) => console.error("  " + c))
  console.error("\nBuild it (src/build.ps1) then set NOVASCRIPT_BIN to the resulting main.exe.")
  process.exit(1)
}

/** Run one source string through the interpreter and return raw stdout/stderr. */
function runInterpreter(bin, source) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "novascript-"))
  try {
    fs.writeFileSync(path.join(workDir, "code.ns"), source, "utf8")
    let stdout = ""
    let stderr = ""
    try {
      stdout = execFileSync(bin, {
        cwd: workDir,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        timeout: 15_000,
        maxBuffer: 16 * 1024 * 1024,
      })
    } catch (err) {
      // A rejected program exits non-zero; that output is still what we want.
      stdout = err.stdout ?? ""
      stderr = err.stderr ?? ""
      if (!stdout && !stderr) throw err
    }
    return { stdout: normalise(stdout), stderr: normalise(stderr) }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true })
  }
}

/**
 * Measure the interpreter itself, so the numbers quoted on the site are counted
 * from the source rather than typed in by hand.
 */
function measureSource(binPath) {
  const srcDir = path.dirname(binPath)
  const includeDir = path.resolve(srcDir, "..", "include")
  if (!fs.existsSync(includeDir)) return null

  const read = (dir, ext) =>
    fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(ext))
      .map((f) => ({ name: f, text: fs.readFileSync(path.join(dir, f), "utf8") }))

  const cpp = read(srcDir, ".cpp")
  const headers = read(includeDir, ".h")
  const countLines = (files) => files.reduce((n, f) => n + f.text.split(/\r?\n/).length, 0)

  const tokenHeader = headers.find((f) => f.name === "Token.h")?.text ?? ""
  const enumBody = tokenHeader.slice(
    tokenHeader.indexOf("enum class TokenType"),
    tokenHeader.indexOf("};", tokenHeader.indexOf("enum class TokenType")),
  )
  const tokenTypes = new Set(
    enumBody
      .replace(/\/\/.*$/gm, "")
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => /^[A-Z][A-Z_0-9]*$/.test(s)),
  )

  const astHeader = headers.find((f) => f.name === "AST.h")?.text ?? ""
  const astNodes = new Set(
    [...astHeader.matchAll(/^\s*class\s+(\w+(?:Expr|Stmt))\b/gm)].map((m) => m[1]),
  )

  return {
    linesOfCpp: countLines(cpp) + countLines(headers),
    cppFiles: cpp.length + headers.length,
    tokenTypes: tokenTypes.size,
    astNodeTypes: astNodes.size,
    astNodeNames: [...astNodes].sort(),
  }
}

function main() {
  const bin = resolveInterpreter()
  const stat = fs.statSync(bin)
  console.log(`interpreter: ${bin}`)
  console.log(`built:       ${stat.mtime.toISOString()}\n`)

  const examples = []
  let problems = 0

  for (const entry of MANIFEST) {
    const file = path.join(EXAMPLES_DIR, entry.file)
    if (!fs.existsSync(file)) {
      console.error(`  MISSING  ${entry.file}`)
      problems++
      continue
    }

    const source = normalise(fs.readFileSync(file, "utf8")).replace(/\n+$/, "")
    const result = parseRun(source, runInterpreter(bin, source))

    const expected = entry.expectFailure ? !result.succeeded : result.succeeded
    const label = result.succeeded ? "ran" : `stopped in ${result.errorStage ?? "?"}`
    console.log(
      `  ${expected ? "ok " : "BAD"}  ${entry.file.padEnd(18)} ${String(result.tokenCount).padStart(3)} tokens, ${label}`,
    )
    if (!expected) {
      problems++
      console.error(`         expected ${entry.expectFailure ? "a rejection" : "a clean run"}`)
      if (result.error) console.error(`         got: ${result.error}`)
    }

    examples.push({
      id: entry.file.replace(/\.ns$/, ""),
      title: entry.title,
      category: entry.category,
      description: entry.description,
      highlight: entry.highlight ?? null,
      expectFailure: Boolean(entry.expectFailure),
      ...result,
    })
  }

  const stats = measureSource(bin)
  if (stats) {
    console.log(
      `\nsource: ${stats.linesOfCpp} lines of C++ across ${stats.cppFiles} files, ` +
        `${stats.tokenTypes} token types, ${stats.astNodeTypes} AST node types`,
    )
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    interpreter: { path: bin, builtAt: stat.mtime.toISOString() },
    stats,
    note: "Generated by scripts/generate-examples.mjs. Every field below is captured stdout from the C++ interpreter — do not edit by hand.",
    examples,
  }

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(payload, null, 2) + "\n", "utf8")

  console.log(`\nwrote ${path.relative(ROOT, OUT_FILE)} (${examples.length} examples)`)
  if (problems) {
    console.error(`${problems} example(s) did not behave as declared.`)
    process.exit(1)
  }
}

main()
