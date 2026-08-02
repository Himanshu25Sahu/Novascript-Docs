"use client"

import { useMemo, useState } from "react"
import { Check, X, Minus, Copy, CheckCheck, AlertTriangle } from "lucide-react"

/* ------------------------------------------------------------------ */
/* Source highlighting                                                 */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  "let", "set", "be", "as", "say", "when", "then", "otherwise", "match", "case",
  "repeat", "while", "for", "from", "to", "until", "step", "starting", "in", "at",
  "define", "function", "call", "return", "throw", "end", "increase", "by", "with",
  "create", "model", "try", "catch", "open", "file", "block", "Integer", "long",
])

/** Line indices (0-based) that sit inside a block comment. */
function commentLines(source) {
  const inside = new Set()
  let open = false
  source.split("\n").forEach((line, i) => {
    const opens = line.includes("/*")
    const closes = line.includes("*/")
    if (open || opens) inside.add(i)
    if (opens && !closes) open = true
    if (closes) open = false
  })
  return inside
}

const TOKEN_RE = /(#.*$)|("(?:[^"\\]|\\.)*")|(\d+(?:\.\d+)?)|([A-Za-z_][A-Za-z0-9_]*)|([+\-*/<>=!]+)/g

function highlight(line) {
  const parts = []
  let last = 0
  let match
  TOKEN_RE.lastIndex = 0
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > last) parts.push({ text: line.slice(last, match.index) })
    const [text, comment, string, number, word, operator] = match
    if (comment) parts.push({ text, className: "text-gray-500 italic" })
    else if (string) parts.push({ text, className: "text-emerald-300" })
    else if (number) parts.push({ text, className: "text-amber-300" })
    else if (word) parts.push({ text, className: KEYWORDS.has(word) ? "text-sky-300" : "text-gray-100" })
    else if (operator) parts.push({ text, className: "text-fuchsia-300" })
    last = match.index + text.length
  }
  if (last < line.length) parts.push({ text: line.slice(last) })
  return parts
}

/* ------------------------------------------------------------------ */
/* Token colouring — mirrors the TokenType enum in include/Token.h     */
/* ------------------------------------------------------------------ */

const OPERATORS = new Set([
  "PLUS", "MINUS", "STAR", "SLASH", "EQUAL", "GREATER", "LESS", "UNDERSCORE",
  "GREATER_EQUAL", "LESS_EQUAL", "NOT_EQUAL", "EQUAL_EQUAL",
])
const PUNCTUATION = new Set([
  "LEFT_PAREN", "RIGHT_PAREN", "LEFT_BRACE", "RIGHT_BRACE",
  "LEFT_BRACKET", "RIGHT_BRACKET", "SEMICOLON", "COMMA", "COLON",
])
const STRUCTURAL = new Set(["INDENT", "DEDENT", "NEWLINE", "END_OF_FILE"])

function tokenColor(type) {
  if (STRUCTURAL.has(type)) return "text-gray-500"
  if (type === "IDENTIFIER") return "text-gray-100"
  if (type === "NUMBER") return "text-amber-300"
  if (type === "STRING") return "text-emerald-300"
  if (OPERATORS.has(type)) return "text-fuchsia-300"
  if (PUNCTUATION.has(type)) return "text-gray-400"
  return "text-sky-300"
}

/* ------------------------------------------------------------------ */
/* Stage bar                                                           */
/* ------------------------------------------------------------------ */

const STAGE_STYLES = {
  ok: {
    box: "border-emerald-600/40 bg-emerald-500/10",
    label: "text-emerald-300",
    detail: "text-emerald-500/80",
    Icon: Check,
  },
  failed: {
    box: "border-red-600/50 bg-red-500/10",
    label: "text-red-300",
    detail: "text-red-400/80",
    Icon: X,
  },
  skipped: {
    box: "border-gray-700 bg-gray-800/40",
    label: "text-gray-500",
    detail: "text-gray-600",
    Icon: Minus,
  },
}

function StageBar({ stages, activeTab, onSelect }) {
  const tabForStage = { lex: "tokens", parse: "ast", semantic: "symbols", run: "output" }

  return (
    <div className="flex flex-wrap items-stretch gap-2 border-t border-gray-800 bg-gray-900/60 px-3 py-3 sm:px-4">
      {stages.map((stage, index) => {
        const style = STAGE_STYLES[stage.status] ?? STAGE_STYLES.skipped
        const tab = tabForStage[stage.id]
        const isActive = tab === activeTab
        return (
          <div key={stage.id} className="flex items-stretch gap-2">
            {index > 0 && <span className="self-center text-gray-700">→</span>}
            <button
              type="button"
              onClick={() => onSelect(tab)}
              className={`flex items-center gap-2 rounded-md border px-3 py-1.5 text-left transition-colors hover:brightness-125 ${style.box} ${
                isActive ? "ring-1 ring-blue-500/60" : ""
              }`}
            >
              <style.Icon className={`h-3.5 w-3.5 shrink-0 ${style.label}`} />
              <span className="leading-tight">
                <span className={`block text-xs font-semibold ${style.label}`}>{stage.name}</span>
                <span className={`block text-[10px] ${style.detail}`}>{stage.detail}</span>
              </span>
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

function EmptyPanel({ children }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <p className="max-w-sm text-center text-sm leading-relaxed text-gray-500">{children}</p>
    </div>
  )
}

function TokensPanel({ tokens, onHoverLine, hoverLine }) {
  return (
    <div className="divide-y divide-gray-800/60">
      {tokens.map((token, i) => (
        <div
          key={i}
          onMouseEnter={() => onHoverLine(token.line)}
          onMouseLeave={() => onHoverLine(null)}
          className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-3 py-1 font-mono text-xs transition-colors sm:px-4 ${
            hoverLine === token.line ? "bg-blue-500/10" : "hover:bg-gray-800/40"
          }`}
        >
          <span className={`truncate ${tokenColor(token.type)}`}>{token.lexeme}</span>
          <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] tracking-wide text-gray-400">
            {token.type}
          </span>
          <span className="w-10 text-right text-[10px] text-gray-600">L{token.line}</span>
        </div>
      ))}
    </div>
  )
}

function SymbolsPanel({ scopes, onHoverLine, hoverLine }) {
  return (
    <div className="space-y-4 p-3 sm:p-4">
      {scopes.map((scope) => (
        <div key={scope.depth}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-500">
            Scope {scope.depth}
            {scope.depth === 0 ? " — global" : " — nested"}
          </p>
          <div className="overflow-hidden rounded-md border border-gray-800">
            {scope.symbols.map((symbol) => (
              <div
                key={symbol.name}
                onMouseEnter={() => onHoverLine(symbol.line)}
                onMouseLeave={() => onHoverLine(null)}
                className={`flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-gray-800 px-3 py-2 font-mono text-xs last:border-b-0 transition-colors ${
                  hoverLine === symbol.line ? "bg-blue-500/10" : "hover:bg-gray-800/40"
                }`}
              >
                <span className="text-gray-100">{symbol.name}</span>
                <span className="rounded bg-gray-800 px-1.5 py-0.5 text-[10px] text-sky-300">
                  {symbol.type}
                </span>
                {symbol.parameters?.length ? (
                  <span className="text-[10px] text-gray-400">({symbol.parameters.join(", ")})</span>
                ) : null}
                {symbol.returnType ? (
                  <span className="text-[10px] text-gray-400">→ {symbol.returnType}</span>
                ) : null}
                <span className="ml-auto text-[10px] text-gray-600">L{symbol.line}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Explorer                                                            */
/* ------------------------------------------------------------------ */

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

  const tabs = [
    { id: "tokens", label: "Tokens", count: example.tokenCount, available: example.tokens.length > 0 },
    { id: "ast", label: "AST", count: example.statementCount, available: Boolean(example.ast) },
    {
      id: "symbols",
      label: "Symbols",
      count: example.symbolTable.reduce((n, s) => n + s.symbols.length, 0),
      available: example.symbolTable.length > 0,
    },
    {
      id: "output",
      label: "Output",
      count: example.output ? example.output.split("\n").length : 0,
      available: example.output !== null,
    },
  ]

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

        {/* Inspector */}
        <div className="flex min-w-0 flex-col">
          <div className="flex border-b border-gray-800 bg-gray-900/40">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 border-b-2 px-2 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-white"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {tab.available && (
                  <span className="ml-1.5 text-[10px] text-gray-600">{tab.count}</span>
                )}
                {!tab.available && <span className="ml-1.5 text-[10px] text-red-500/70">—</span>}
              </button>
            ))}
          </div>

          <div className="h-[320px] overflow-auto lg:h-[540px]">
            {activeTab === "tokens" &&
              (example.tokens.length ? (
                <TokensPanel tokens={example.tokens} hoverLine={hoverLine} onHoverLine={setHoverLine} />
              ) : (
                <EmptyPanel>The lexer produced no tokens for this program.</EmptyPanel>
              ))}

            {activeTab === "ast" &&
              (example.ast ? (
                <pre className="min-w-max p-3 font-mono text-xs leading-5 text-gray-300 sm:p-4">
                  {example.ast}
                </pre>
              ) : (
                <EmptyPanel>
                  The parser rejected this program, so no syntax tree was built. See the Output tab.
                </EmptyPanel>
              ))}

            {activeTab === "symbols" &&
              (example.symbolTable.length ? (
                <SymbolsPanel
                  scopes={example.symbolTable}
                  hoverLine={hoverLine}
                  onHoverLine={setHoverLine}
                />
              ) : (
                <EmptyPanel>
                  The analyser stopped before it could print a symbol table.
                </EmptyPanel>
              ))}

            {activeTab === "output" && (
              <div className="p-3 sm:p-4">
                {example.output !== null && (
                  <pre className="whitespace-pre-wrap rounded-md border-l-2 border-emerald-500 bg-black/40 p-3 font-mono text-xs leading-6 text-emerald-300">
                    {example.output}
                  </pre>
                )}
                {example.error && (
                  <div className="flex gap-2 rounded-md border-l-2 border-red-500 bg-red-500/5 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-red-300">
                        {example.expectFailure ? "Rejected, as intended" : "The interpreter stopped"}
                      </p>
                      <p className="mt-1 break-words font-mono text-xs leading-relaxed text-red-200/90">
                        {example.error}
                      </p>
                    </div>
                  </div>
                )}
                {example.output === null && !example.error && (
                  <EmptyPanel>This program printed nothing.</EmptyPanel>
                )}
                {example.highlight && (
                  <p className="mt-4 border-t border-gray-800 pt-3 text-xs leading-relaxed text-gray-500">
                    {example.highlight}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
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
