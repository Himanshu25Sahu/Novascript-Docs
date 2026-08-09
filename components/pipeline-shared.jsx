"use client"

/**
 * Presentation shared by the pre-generated explorer and the live playground.
 *
 * Both are showing the output of the same interpreter, so they render it with
 * the same components. Only the source pane differs between them - one is a
 * listing, the other an editor.
 */

import { Check, X, Minus, AlertTriangle } from "lucide-react"

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
export function commentLines(source) {
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

export function highlight(line) {
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

export function tokenColor(type) {
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

const TAB_FOR_STAGE = { lex: "tokens", parse: "ast", semantic: "symbols", run: "output" }

export function StageBar({ stages, activeTab, onSelect }) {
  return (
    <div className="flex flex-wrap items-stretch gap-2 border-t border-gray-800 bg-gray-900/60 px-3 py-3 sm:px-4">
      {stages.map((stage, index) => {
        const style = STAGE_STYLES[stage.status] ?? STAGE_STYLES.skipped
        const tab = TAB_FOR_STAGE[stage.id]
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

export function EmptyPanel({ children }) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <p className="max-w-sm text-center text-sm leading-relaxed text-gray-500">{children}</p>
    </div>
  )
}

export function TokensPanel({ tokens, onHoverLine, hoverLine }) {
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

export function SymbolsPanel({ scopes, onHoverLine, hoverLine }) {
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
/* Inspector — the four result tabs                                    */
/* ------------------------------------------------------------------ */

export function inspectorTabs(result) {
  return [
    { id: "tokens", label: "Tokens", count: result.tokenCount, available: result.tokens.length > 0 },
    { id: "ast", label: "AST", count: result.statementCount, available: Boolean(result.ast) },
    {
      id: "symbols",
      label: "Symbols",
      count: result.symbolTable.reduce((n, s) => n + s.symbols.length, 0),
      available: result.symbolTable.length > 0,
    },
    {
      id: "output",
      label: "Output",
      count: result.output ? result.output.split("\n").length : 0,
      available: result.output !== null,
    },
  ]
}

/**
 * The tab strip and the panel below it. `errorTitle` lets the caller word the
 * failure differently — a curated example that fails is doing so on purpose,
 * a program someone just typed is not.
 */
export function Inspector({
  result,
  activeTab,
  onSelectTab,
  hoverLine,
  onHoverLine,
  errorTitle,
  footnote,
  height = "h-[320px] lg:h-[540px]",
}) {
  const tabs = inspectorTabs(result)

  return (
    <div className="flex min-w-0 flex-col">
      <div className="flex border-b border-gray-800 bg-gray-900/40">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`flex-1 border-b-2 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.id
                ? "border-blue-500 text-white"
                : "border-transparent text-gray-500 hover:text-gray-300"
            }`}
          >
            {tab.label}
            {tab.available && <span className="ml-1.5 text-[10px] text-gray-600">{tab.count}</span>}
            {!tab.available && <span className="ml-1.5 text-[10px] text-red-500/70">—</span>}
          </button>
        ))}
      </div>

      <div className={`overflow-auto ${height}`}>
        {activeTab === "tokens" &&
          (result.tokens.length ? (
            <TokensPanel tokens={result.tokens} hoverLine={hoverLine} onHoverLine={onHoverLine} />
          ) : (
            <EmptyPanel>The lexer produced no tokens for this program.</EmptyPanel>
          ))}

        {activeTab === "ast" &&
          (result.ast ? (
            <pre className="min-w-max p-3 font-mono text-xs leading-5 text-gray-300 sm:p-4">
              {result.ast}
            </pre>
          ) : (
            <EmptyPanel>
              The parser rejected this program, so no syntax tree was built. See the Output tab.
            </EmptyPanel>
          ))}

        {activeTab === "symbols" &&
          (result.symbolTable.length ? (
            <SymbolsPanel
              scopes={result.symbolTable}
              hoverLine={hoverLine}
              onHoverLine={onHoverLine}
            />
          ) : (
            <EmptyPanel>The analyser stopped before it could print a symbol table.</EmptyPanel>
          ))}

        {activeTab === "output" && (
          <div className="p-3 sm:p-4">
            {result.output !== null && result.output !== "" && (
              <pre className="whitespace-pre-wrap rounded-md border-l-2 border-emerald-500 bg-black/40 p-3 font-mono text-xs leading-6 text-emerald-300">
                {result.output}
              </pre>
            )}
            {result.error && (
              <div className="mt-3 flex gap-2 rounded-md border-l-2 border-red-500 bg-red-500/5 p-3 first:mt-0">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-red-300">{errorTitle}</p>
                  <p className="mt-1 break-words font-mono text-xs leading-relaxed text-red-200/90">
                    {result.error}
                  </p>
                </div>
              </div>
            )}
            {(result.output === null || result.output === "") && !result.error && (
              <EmptyPanel>This program printed nothing.</EmptyPanel>
            )}
            {footnote && (
              <p className="mt-4 border-t border-gray-800 pt-3 text-xs leading-relaxed text-gray-500">
                {footnote}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
