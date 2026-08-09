/**
 * Turns the interpreter's printed output into the structure the UI renders.
 *
 * This is shared deliberately. `scripts/generate-examples.mjs` runs the native
 * binary at build time and the playground runs the WebAssembly build in the
 * browser, but both produce the same text from the same C++ code, so both are
 * parsed here. Keeping one parser is what stops the pre-generated examples and
 * the live runner from quietly disagreeing.
 */

export const normalise = (s) => s.replace(/\r\n/g, "\n")

export function between(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker)
  if (start === -1) return ""
  const from = start + startMarker.length
  const end = endMarker ? text.indexOf(endMarker, from) : -1
  return text.slice(from, end === -1 ? undefined : end).trim()
}

/** `Token: define               (DEFINE) at line 3` */
export function parseTokens(stdout) {
  const tokens = []
  const re = /^Token:\s+(.*?)\s+\((\w+)\) at line (\d+)$/gm
  let m
  while ((m = re.exec(stdout)) !== null) {
    tokens.push({ lexeme: m[1], type: m[2], line: Number(m[3]) })
  }
  return tokens
}

/**
 * Symbol table, grouped the way the interpreter prints it:
 *   Scope 0:
 *     Variable: answer (Type: INTEGER, Line: 16)
 */
export function parseSymbolTable(stdout) {
  const block = between(stdout, "Symbol Table:", "\nInterpreting program...")
  if (!block) return []

  const scopes = []
  for (const raw of block.split("\n")) {
    const line = raw.trim()
    const scope = line.match(/^Scope (\d+):$/)
    if (scope) {
      scopes.push({ depth: Number(scope[1]), symbols: [] })
      continue
    }
    const sym = line.match(/^Variable:\s+(\S+)\s+\(Type:\s+([^,)]+)(.*)\)$/)
    if (sym && scopes.length) {
      const rest = sym[3]
      const params = rest.match(/Parameters:\s*\[([^\]]*)\]/)
      const returns = rest.match(/Return Type:\s*(\w+)/)
      const declaredAt = rest.match(/Line:\s*(\d+)/)
      scopes[scopes.length - 1].symbols.push({
        name: sym[1],
        type: sym[2].trim(),
        parameters: params ? params[1].split(",").map((p) => p.trim()).filter(Boolean) : null,
        returnType: returns ? returns[1] : null,
        line: declaredAt ? Number(declaredAt[1]) : null,
      })
    }
  }
  return scopes
}

/** Program output is fenced between two underscore rules. */
export function parseProgramOutput(stdout) {
  const RULE = "________________________________________"
  const first = stdout.indexOf(RULE)
  if (first === -1) return null
  const second = stdout.indexOf(RULE, first + RULE.length)
  const body = stdout.slice(first + RULE.length, second === -1 ? undefined : second)
  return body.replace(/^\n/, "").replace(/\n$/, "")
}

export function parseRun(source, { stdout, stderr }) {
  const tokens = parseTokens(stdout)
  const astBlock = between(stdout, "Abstract Syntax Tree (AST):", "\nSemantic analysis successful!")
  const ast = astBlock || between(stdout, "Abstract Syntax Tree (AST):", "\nSemantic error")
  const symbolTable = parseSymbolTable(stdout)
  const output = parseProgramOutput(stdout)

  const statementMatch = stdout.match(/Parsed (\d+) tokens into (\d+) statements/)
  const parseError = stderr.match(/^(Parsing failed at line \d+: .*)$/m)
  const semanticError = stdout.match(/^(Semantic error at line \d+: .*)$/m)
  // "Unknown ... type" is a statement the interpreter has no case for; the
  // limit message means the program was still running when its budget ran out.
  const runtimeMessage = stdout.match(
    /^(Unknown (?:statement|expression) type|Execution limit exceeded after \d+ steps)$/m,
  )

  const parsed = stdout.includes("Parsing successful!")
  const analysed = stdout.includes("Semantic analysis successful!")
  const interpreted = stdout.includes("Interpretation successful!")

  const stages = [
    {
      id: "lex",
      name: "Lexer",
      status: tokens.length ? "ok" : "failed",
      detail: tokens.length ? `${tokens.length} tokens` : "no tokens",
    },
    {
      id: "parse",
      name: "Parser",
      status: parsed ? "ok" : "failed",
      detail: parsed
        ? `${statementMatch ? statementMatch[2] : "?"} statements`
        : "rejected",
    },
    {
      id: "semantic",
      name: "Semantic",
      status: analysed ? "ok" : parsed ? "failed" : "skipped",
      detail: analysed
        ? `${symbolTable.reduce((n, s) => n + s.symbols.length, 0)} symbols`
        : parsed
          ? "rejected"
          : "not reached",
    },
    {
      id: "run",
      name: "Interpreter",
      status: interpreted ? "ok" : analysed ? "failed" : "skipped",
      detail: interpreted
        ? `${output ? output.split("\n").filter(Boolean).length : 0} lines out`
        : analysed
          ? "halted"
          : "not reached",
    },
  ]

  const error = parseError?.[1] ?? semanticError?.[1] ?? runtimeMessage?.[1] ?? null

  return {
    source,
    tokens,
    tokenCount: tokens.length,
    statementCount: statementMatch ? Number(statementMatch[2]) : null,
    ast: ast || null,
    symbolTable,
    output,
    error,
    errorStage: parseError ? "parse" : semanticError ? "semantic" : runtimeMessage ? "run" : null,
    succeeded: interpreted,
    stages,
    rawStdout: stdout,
    rawStderr: stderr.split("\n").filter((l) => l && !l.startsWith("Debug:")).join("\n"),
  }
}
