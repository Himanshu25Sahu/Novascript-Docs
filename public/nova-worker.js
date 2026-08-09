/**
 * Runs the NovaScript interpreter off the main thread.
 *
 * Everything here exists so that a visitor's program cannot hurt the page.
 * The interpreter's own step budget stops ordinary runaway loops and still
 * returns whatever the program printed first, but a budget cannot help if the
 * WebAssembly instance traps or allocates pathologically - only killing the
 * thread can, and only a worker can be killed. The page terminates this worker
 * on a timeout and starts a fresh one for the next run.
 */

let modulePromise = null

// Instantiated on the first run rather than at load, so visiting the page
// costs nothing until someone actually asks for a result.
function getModule() {
  if (!modulePromise) {
    modulePromise = import("/wasm/nova.js").then((m) => m.default())
  }
  return modulePromise
}

self.onmessage = async (event) => {
  const { id, source } = event.data
  try {
    const wasm = await getModule()
    const result = wasm.analyze(source)
    // Copy the fields out: the object is backed by the WebAssembly heap and
    // is not structured-cloneable as-is.
    self.postMessage({
      id,
      ok: true,
      stdout: result.stdout,
      stderr: result.stderr,
    })
  } catch (err) {
    self.postMessage({ id, ok: false, error: String(err?.message ?? err) })
  }
}
