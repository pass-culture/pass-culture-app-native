const TIMEOUT_IN_MS = 300

export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout: number = TIMEOUT_IN_MS
) {
  const controller = new AbortController()
  const timeoutId = globalThis.setTimeout(() => {
    controller.abort()
  }, timeout)
  const response = await fetch(url, { ...options })
  globalThis.clearTimeout(timeoutId)
  return response
}
