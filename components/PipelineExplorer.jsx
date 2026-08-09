"use client"

/**
 * The pre-generated explorer: pick one of the bundled programs and step through
 * what the interpreter did with it. Everything shown here was captured from the
 * real binary at build time by scripts/generate-examples.mjs.
 *
 * The result panels are shared with the live playground - see pipeline-shared.
 */

import { useMemo, useState } from "react"
import { Copy, CheckCheck } from "lucide-react"

import { Inspector, StageBar, commentLines, highlight } from "./pipeline-shared"

export default function PipelineExplorer({ examples, generatedAt, showPicker = true }) {
  const [activeId, setActiveId] = useState(examples[0].id)
  const [activeTab, setActiveTab] = useState("tokens")
  const [hoverLine, setHoverLine] = useState(null)
  const [copied, setCopied] = useState(false)

  const example = useMemo(
    () => examples.find((e) => e.id === activeId) ?? examples[0],
    [examples, activeId],
  )

  const lines = useMemo(() => example.source.split("\n"), [example])
  const blockComments = useMemo(() => commentLines(example.source), [example])

  function selectExample(id) {
    setActiveId(id)
    setActiveTab("tokens")
    setHoverLine(null)
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(example.source)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950 shadow-2xl">
      {/* Example picker */}
      {showPicker && (
        <div className="flex gap-1.5 overflow-x-auto border-b border-gray-800 bg-gray-900/70 px-3 py-2.5">
          {examples.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectExample(item.id)}
              className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                item.id === activeId
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              }`}
            >
              {item.title}
              {item.expectFailure && (
                <span className={item.id === activeId ? "ml-1.5 text-red-200" : "ml-1.5 text-red-400/70"}>
                  ✕
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Title strip */}
      <div className="border-b border-gray-800 px-4 py-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-base font-semibold text-white">{example.title}</h3>
          <span className="text-[10px] font-medium uppercase tracking-widest text-gray-500">
            {example.category}
          </span>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-gray-400">{example.description}</p>
      </div>

      {/* Source + inspector */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Source */}
        <div className="flex min-w-0 flex-col border-b border-gray-800 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-gray-800 bg-gray-900/40 px-4 py-2">
            <span className="font-mono text-xs text-gray-400">code.ns</span>
            <button
              type="button"
              onClick={copySource}
              className="flex items-center gap-1.5 rounded px-2 py-1 text-[11px] text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300"
            >
              {copied ? <CheckCheck className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="h-[320px] overflow-auto lg:h-[540px]">
            <pre className="min-w-max py-2 font-mono text-xs leading-6">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={`flex px-1 transition-colors ${
                    hoverLine === i + 1 ? "bg-blue-500/15" : ""
                  }`}
                >
                  <span className="sticky left-0 w-10 shrink-0 select-none bg-gray-950 pr-3 text-right text-gray-700">
                    {i + 1}
                  </span>
                  <code className="pr-4">
                    {blockComments.has(i) ? (
                      <span className="italic text-gray-500">{line || " "}</span>
                    ) : (
                      highlight(line).map((part, j) => (
                        <span key={j} className={part.className}>
                          {part.text}
                        </span>
                      ))
                    )}
                  </code>
                </div>
              ))}
            </pre>
          </div>
        </div>

        <Inspector
          result={example}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          hoverLine={hoverLine}
          onHoverLine={setHoverLine}
          errorTitle={example.expectFailure ? "Rejected, as intended" : "The interpreter stopped"}
          footnote={example.highlight}
        />
      </div>

      <StageBar stages={example.stages} activeTab={activeTab} onSelect={setActiveTab} />

      <div className="border-t border-gray-800 bg-gray-900/40 px-4 py-2">
        <p className="text-[11px] text-gray-500">
          Captured stdout from the C++ interpreter
          {generatedAt ? `, ${new Date(generatedAt).toISOString().slice(0, 10)}` : ""} ·{" "}
          <span className="font-mono text-gray-400">npm run gen:examples</span>
        </p>
      </div>
    </div>
  )
}
