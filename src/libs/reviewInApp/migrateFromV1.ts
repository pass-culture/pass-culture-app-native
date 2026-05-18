import { readHistory, STORAGE_KEY } from 'libs/reviewInApp/reviewHistory'
import { REVIEW_QUOTA_LIMIT, REVIEW_WINDOW_MS } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

const V1_TIMES_KEY = 'times_review_has_been_requested'
const V1_FIRST_KEY = 'first_time_review_has_been_requested'
export const MIGRATION_DONE_KEY = 'review_v2_migration_done'

export const runMigrationFromV1 = async (now: number = Date.now()): Promise<void> => {
  const alreadyDone = await storage.readString(MIGRATION_DONE_KEY)
  if (alreadyDone) return

  const [timesRaw, firstRaw] = await Promise.all([
    storage.readObject<unknown>(V1_TIMES_KEY),
    storage.readObject<unknown>(V1_FIRST_KEY),
  ])

  const times = typeof timesRaw === 'number' && Number.isFinite(timesRaw) ? timesRaw : null
  const first = typeof firstRaw === 'number' && Number.isFinite(firstRaw) ? firstRaw : null
  const existingHistory = await readHistory(now)

  const shouldMigrate =
    existingHistory.length === 0 &&
    times !== null &&
    times > 0 &&
    first !== null &&
    first > now - REVIEW_WINDOW_MS

  if (shouldMigrate) {
    // V1 only stored the date of the FIRST prompt, not each prompt's date.
    // We approximate by clustering N entries near `first` — conservative
    // because the lock 30j and the 365j window will be computed from `first`.
    const count = Math.min(times, REVIEW_QUOTA_LIMIT)
    const migrated = Array.from({ length: count }, (_, i) => first + i)
    await storage.saveObject(STORAGE_KEY, migrated)
  }

  await Promise.all([
    storage.clear(V1_TIMES_KEY),
    storage.clear(V1_FIRST_KEY),
    storage.saveString(MIGRATION_DONE_KEY, '1'),
  ])
}
