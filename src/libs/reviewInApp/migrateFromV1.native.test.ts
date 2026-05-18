import { MIGRATION_DONE_KEY, runMigrationFromV1 } from 'libs/reviewInApp/migrateFromV1'
import { canRequestReview, readHistory } from 'libs/reviewInApp/reviewHistory'
import { REVIEW_LOCK_DURATION_MS, REVIEW_WINDOW_MS } from 'libs/reviewInApp/types'
import { storage } from 'libs/storage'

const NOW = 1_700_000_000_000
const TEN_DAYS_MS = 10 * 24 * 60 * 60 * 1000

describe('runMigrationFromV1', () => {
  beforeEach(async () => {
    await storage.clear('times_review_has_been_requested')
    await storage.clear('first_time_review_has_been_requested')
    await storage.clear('review_request_history')
    await storage.clear(MIGRATION_DONE_KEY)
  })

  it('always removes V1 keys after running', async () => {
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)

    expect(await storage.readObject('times_review_has_been_requested')).toBeNull()
    expect(await storage.readObject('first_time_review_has_been_requested')).toBeNull()
  })

  it('converts V1 count + first date into V2 history', async () => {
    const first = NOW - TEN_DAYS_MS
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', first)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([first, first + 1])
  })

  it('caps the migrated count at the V2 quota limit (3)', async () => {
    const first = NOW - TEN_DAYS_MS
    await storage.saveObject('times_review_has_been_requested', 4)
    await storage.saveObject('first_time_review_has_been_requested', first)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([first, first + 1, first + 2])
  })

  it('does not migrate when V1 count is 0', async () => {
    await storage.saveObject('times_review_has_been_requested', 0)
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
  })

  it('does not migrate when V1 first date is older than the 365 days window', async () => {
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', NOW - REVIEW_WINDOW_MS - 1)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
  })

  it('does not migrate when V1 count is corrupted (non-number)', async () => {
    await storage.saveObject('times_review_has_been_requested', 'oops')
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
  })

  it('does not migrate when V1 first date is corrupted', async () => {
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', 'oops')

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
  })

  it('is a no-op when V1 keys are missing', async () => {
    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
  })

  it('does not overwrite an existing V2 history', async () => {
    const v2Existing = [NOW - 1000, NOW - 500]
    await storage.saveObject('review_request_history', v2Existing)
    await storage.saveObject('times_review_has_been_requested', 3)
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual(v2Existing)
  })

  it('is idempotent when called multiple times', async () => {
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)
    const afterFirst = await readHistory(NOW)
    await runMigrationFromV1(NOW)
    const afterSecond = await readHistory(NOW)

    expect(afterSecond).toEqual(afterFirst)
  })

  it('early-returns without touching V1 keys when the migration flag is already set', async () => {
    await storage.saveString(MIGRATION_DONE_KEY, '1')
    await storage.saveObject('times_review_has_been_requested', 2)
    await storage.saveObject('first_time_review_has_been_requested', NOW - TEN_DAYS_MS)

    await runMigrationFromV1(NOW)

    expect(await readHistory(NOW)).toEqual([])
    expect(await storage.readObject('times_review_has_been_requested')).toBe(2)
    expect(await storage.readObject('first_time_review_has_been_requested')).toBe(NOW - TEN_DAYS_MS)
  })

  // Bonus integration scenario: validates the very reason we picked option B
  // over option A. Without migration of V1 history, V2 would have allowed
  // 3 fresh prompts immediately — which the OS would silently block, wasting
  // our V2 quota slots.
  it('after migrating a V1 user at quota, V2 blocks any new request (quota + lock)', async () => {
    const first = NOW - TEN_DAYS_MS
    await storage.saveObject('times_review_has_been_requested', 3)
    await storage.saveObject('first_time_review_has_been_requested', first)

    await runMigrationFromV1(NOW)
    const history = await readHistory(NOW)

    expect(history).toHaveLength(3)
    expect(canRequestReview(history, NOW)).toBe(false)
  })

  it('after migrating a V1 user with 1 prompt 60 days ago, V2 allows a new request', async () => {
    const first = NOW - 60 * 24 * 60 * 60 * 1000
    await storage.saveObject('times_review_has_been_requested', 1)
    await storage.saveObject('first_time_review_has_been_requested', first)

    await runMigrationFromV1(NOW)
    const history = await readHistory(NOW)

    expect(history).toEqual([first])
    expect(canRequestReview(history, NOW)).toBe(true)
  })

  it('after migrating a V1 user with 1 prompt 10 days ago, V2 blocks until the 30 days lock expires', async () => {
    const first = NOW - TEN_DAYS_MS
    await storage.saveObject('times_review_has_been_requested', 1)
    await storage.saveObject('first_time_review_has_been_requested', first)

    await runMigrationFromV1(NOW)
    const history = await readHistory(NOW)

    expect(canRequestReview(history, NOW)).toBe(false)
    expect(canRequestReview(history, first + REVIEW_LOCK_DURATION_MS + 1)).toBe(true)
  })
})
