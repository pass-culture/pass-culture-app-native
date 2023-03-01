const TIMEOUT_IN_MS = 1000

export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout: number = TIMEOUT_IN_MS
) {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort()
  }, timeout)
  const response = await fetch(url, { ...options, signal: controller.signal })
  globalThis.clearTimeout(timeoutId)
  return response
}
