const DEDUP_WINDOW_MS = 1000
const CLEANUP_INTERVAL_MS = 5000

const recentEvents = new Map<string, number>()
let lastCleanup = Date.now()

function generateKey(eventName: string, params?: Record<string, unknown>): string {
  if (!params) return eventName
  const sortedParams = JSON.stringify(
    params,
    Object.keys(params).sort((a, b) => a.localeCompare(b))
  )
  return `${eventName}:${sortedParams}`
}

function cleanup(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  for (const [key, timestamp] of recentEvents) {
    if (now - timestamp > DEDUP_WINDOW_MS) {
      recentEvents.delete(key)
    }
  }
}

export function isDuplicateEvent(eventName: string, params?: Record<string, unknown>): boolean {
  const now = Date.now()
  cleanup(now)

  const key = generateKey(eventName, params)
  const lastSeen = recentEvents.get(key)

  if (lastSeen !== undefined && now - lastSeen < DEDUP_WINDOW_MS) {
    return true
  }

  recentEvents.set(key, now)
  return false
}

export function resetDedupCache(): void {
  recentEvents.clear()
  lastCleanup = Date.now()
}
