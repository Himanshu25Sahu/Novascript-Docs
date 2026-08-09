"use client"

/**
 * The live runner. Unlike the explorer, nothing here is pre-computed: the text
 * in the editor is compiled and run by the real interpreter, built to
 * WebAssembly, in the visitor's own browser.
 *
 * Deliberately plain. The editor is a textarea rather than a code-editor
 * library because the whole point of running in WebAssembly is that the page
 * stays light, and dropping a multi-megabyte editor next to a 227 KB
 * interpreter would be a strange trade.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Play, Loader2, AlertTriangle, RotateCcw } from "lucide-react"

import { Inspector, StageBar, highlight } from "./pipeline-shared"
import { runNova } from "@/lib/runNova"

const IDLE_STAGES = [
  { id: "lex", name: "Lexer", status: "skipped", detail: "not run" },
  { id: "parse", name: "Parser", status: "skipped", detail: "not run" },
  { id: "semantic", name: "Semantic", status: "skipped", detail: "not run" },
  { id: "run", name: "Interpreter", status: "skipped", detail: "not run" },
]

export default function Playground({ snippets }) {
  const initial = snippets[0]
  const [source, setSource] = useState(initial.source)
  const [activeSnippet, setActiveSnippet] = useState(initial.id)
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState("idle") // idle | running | done | error
  const [failure, setFailure] = useState(null)
  const [activeTab, setActiveTab] = useState("output")
  const [hoverLine, setHoverLine] = useState(null)

  const gutterRef = useRef(null)
  const textareaRef = useRef(null)
  const runToken = useRef(0)

  const lines = useMemo(() => source.split("\n"), [source])

  const run = useCallback(async () => {
    const token = ++runToken.current
    setStatus("running")
    setFailure(null)

    const { result: parsed, timedOut, error } = await runNova(source)

    // A newer run started while this one was in flight; drop this answer.
    if (token !== runToken.current) return

    if (parsed) {
      setResult(parsed)
      setStatus("done")
      // Jump to whichever stage has something to say.
      setActiveTab(parsed.errorStage === "parse" ? "output" : parsed.error ? "output" : "output")
    } else {
      setResult(null)
      setStatus("error")
      setFailure(timedOut ? error : error || "Something went wrong.")
    }
  }, [source])

  // Ctrl/Cmd+Enter to run, the shortcut people try first.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        run()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [run])

  function loadSnippet(snippet) {
    setSource(snippet.source)
    setActiveSnippet(snippet.id)
    setResult(null)
    setStatus("idle")
    setFailure(null)
    setHoverLine(null)
  }

  function onEdit(e) {
    setSource(e.target.value)
    setActiveSnippet(null)
  }

  const stages = result?.stages ?? IDLE_STAGES

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
      {/* Snippets */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gray-800 bg-gray-900/70 px-3 py-2.5">
        <span className="mr-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
          Load
        </span>
        {snippets.map((snippet) => (
          <button
            key={snippet.id}
            type="button"
            onClick={() => loadSnippet(snippet)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              snippet.id === activeSnippet
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
          >
            {snippet.title}
            {snippet.expectFailure && (
              <span className={snippet.id === activeSnippet ? "ml-1.5 text-red-200" : "ml-1.5 text-red-400/70"}>
                ✕
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Editor */}
        <div className="flex min-w-0 flex-col border-b border-gray-800 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/40 px-4 py-2">
            <span className="font-mono text-xs text-gray-400">code.ns</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => loadSnippet(snippets.find((s) => s.id === activeSnippet) ?? snippets[0])}
                className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
              <button
                type="button"
                onClick={run}
                disabled={status === "running"}
                className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "running" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
                {status === "running" ? "Running" : "Run"}
              </button>
            </div>
          </div>

          {/* Gutter and textarea scroll together. */}
          <div className="relative flex h-[320px] overflow-hidden lg:h-[540px]">
            <div
              ref={gutterRef}
              className="w-10 shrink-0 select-none overflow-hidden border-r border-gray-800/60 bg-gray-950 py-2 text-right font-mono text-xs leading-6 text-gray-700"
            >
              {lines.map((_, i) => (
                <div key={i} className="pr-2">
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={source}
              onChange={onEdit}
              onScroll={(e) => {
                if (gutterRef.current) gutterRef.current.scrollTop = e.target.scrollTop
              }}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="NovaScript source code"
              className="flex-1 resize-none bg-transparent py-2 pl-3 pr-4 font-mono text-xs leading-6 text-gray-100 outline-none"
            />
          </div>

          <div className="border-t border-gray-800 bg-gray-900/40 px-4 py-1.5">
            <p className="text-[11px] text-gray-600">
              {lines.length} line{lines.length === 1 ? "" : "s"} ·{" "}
              <kbd className="rounded border border-gray-700 px-1 font-sans text-[10px] text-gray-500">
                Ctrl
              </kbd>
              +
              <kbd className="rounded border border-gray-700 px-1 font-sans text-[10px] text-gray-500">
                Enter
              </kbd>{" "}
              to run
            </p>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <Inspector
            result={result}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            hoverLine={hoverLine}
            onHoverLine={setHoverLine}
            errorTitle="The interpreter stopped"
          />
        ) : (
          <div className="flex min-w-0 flex-col">
            <div className="flex border-b border-gray-800 bg-gray-900/40">
              {["Tokens", "AST", "Symbols", "Output"].map((label) => (
                <span
                  key={label}
                  className="flex-1 border-b-2 border-transparent px-2 py-2 text-center text-xs font-medium text-gray-700"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="flex h-[320px] items-center justify-center p-8 lg:h-[540px]">
              {status === "error" ? (
                <div className="flex max-w-sm gap-2 rounded-md border-l-2 border-red-500 bg-red-500/5 p-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-red-300">Stopped</p>
                    <p className="mt-1 break-words text-xs leading-relaxed text-red-200/90">
                      {failure}
                    </p>
                  </div>
                </div>
              ) : status === "running" ? (
                <p className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running the interpreter…
                </p>
              ) : (
                <p className="max-w-xs text-center text-sm leading-relaxed text-gray-500">
                  Press <span className="font-semibold text-gray-400">Run</span> to compile and
                  execute this program. The interpreter is downloaded the first time you do.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <StageBar stages={stages} activeTab={activeTab} onSelect={setActiveTab} />

      <div className="border-t border-gray-800 bg-gray-900/40 px-4 py-2">
        <p className="text-[11px] text-gray-500">
          The C++ interpreter compiled to WebAssembly, running in this tab ·{" "}
          <span className="font-mono text-gray-400">227 KB</span>
        </p>
      </div>
    </div>
  )
}
