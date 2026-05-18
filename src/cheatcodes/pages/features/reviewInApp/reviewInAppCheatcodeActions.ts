import { MIGRATION_DONE_KEY, runMigrationFromV1 } from 'libs/reviewInApp/migrateFromV1'
import { appendHistory, clearHistory, STORAGE_KEY } from 'libs/reviewInApp/reviewHistory'
import { REVIEW_LOCK_DURATION_MS, REVIEW_QUOTA_LIMIT } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const seedPromptNow = async (): Promise<void> => {
  await appendHistory(Date.now())
}

export const seedPromptOutOfLock = async (): Promise<void> => {
  await appendHistory(Date.now() - REVIEW_LOCK_DURATION_MS - ONE_DAY_MS)
}

export const seedQuotaSaturated = async (): Promise<void> => {
  const now = Date.now()
  const recent = Array.from({ length: REVIEW_QUOTA_LIMIT }, (_, i) => now - i * 1000)
  await storage.saveObject(STORAGE_KEY, recent)
}

export const resetHistory = async (): Promise<void> => {
  await clearHistory()
}

export const seedV1Data = async (): Promise<void> => {
  const now = Date.now()
  await Promise.all([
    storage.saveObject('times_review_has_been_requested', 2),
    storage.saveObject('first_time_review_has_been_requested', now - 60 * ONE_DAY_MS),
  ])
}

export const replayMigrationFromV1 = async (): Promise<void> => {
  await storage.clear(MIGRATION_DONE_KEY)
  await runMigrationFromV1()
}
