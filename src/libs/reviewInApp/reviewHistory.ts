import {
  REVIEW_LOCK_DURATION_MS,
  REVIEW_QUOTA_LIMIT,
  REVIEW_WINDOW_MS,
} from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

export const STORAGE_KEY = 'review_request_history'

const purge = (history: number[], now: number): number[] =>
  history.filter((timestamp) => timestamp > now - REVIEW_WINDOW_MS)

export const readHistory = async (now: number = Date.now()): Promise<number[]> => {
  const raw = await storage.readObject<number[]>(STORAGE_KEY)
  if (!Array.isArray(raw)) return []
  return purge(
    raw.filter((value): value is number => typeof value === 'number'),
    now
  )
}

export const appendHistory = async (timestamp: number): Promise<void> => {
  const history = await readHistory(timestamp)
  await storage.saveObject(STORAGE_KEY, [...history, timestamp])
}

export const clearHistory = async (): Promise<void> => {
  await storage.clear(STORAGE_KEY)
}

export const canRequestReview = (history: number[], now: number): boolean => {
  const purged = purge(history, now)
  if (purged.length >= REVIEW_QUOTA_LIMIT) return false
  if (purged.length === 0) return true
  const mostRecent = Math.max(...purged)
  return mostRecent <= now - REVIEW_LOCK_DURATION_MS
}
