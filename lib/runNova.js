/**
 * Client-side entry point for running a NovaScript program.
 *
 * One worker per run. That is deliberate rather than wasteful: a WebAssembly
 * trap leaves the instance permanently unusable, so reusing a worker means the
 * run after a bad one fails for no visible reason. Starting fresh also means
 * terminate() is always a complete cleanup.
 */

import { parseRun, normalise } from "./parseRun.mjs"

// The interpreter stops itself after its step budget, which measures at well
// under a second. This is the outer bound for everything that budget cannot
// cover - a trap, or a pathological allocation - so it is set far enough above
// the budget that the graceful path always wins the race.
const HARD_TIMEOUT_MS = 5000

export const TIMEOUT_MESSAGE =
  `The program was still running after ${HARD_TIMEOUT_MS / 1000} seconds and was stopped.`

/**
 * @returns {Promise<{result: object|null, timedOut: boolean, error: string|null}>}
 */
export function runNova(source) {
  return new Promise((resolve) => {
    let worker
    try {
      worker = new Worker("/nova-worker.js", { type: "module" })
    } catch (err) {
      resolve({ result: null, timedOut: false, error: String(err?.message ?? err) })
      return
    }

    let settled = false
    const finish = (payload) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      worker.terminate()
      resolve(payload)
    }

    const timer = setTimeout(
      () => finish({ result: null, timedOut: true, error: TIMEOUT_MESSAGE }),
      HARD_TIMEOUT_MS,
    )

    worker.onmessage = (event) => {
      const data = event.data
      if (!data?.ok) {
        finish({ result: null, timedOut: false, error: data?.error ?? "The interpreter failed to start." })
        return
      }
      const clean = normalise(source)
      finish({
        result: parseRun(clean, {
          stdout: normalise(data.stdout),
          stderr: normalise(data.stderr),
        }),
        timedOut: false,
        error: null,
      })
    }

    worker.onerror = (event) => {
      finish({
        result: null,
        timedOut: false,
        error: event?.message || "The interpreter could not be loaded.",
      })
    }

    worker.postMessage({ id: 1, source })
  })
}
