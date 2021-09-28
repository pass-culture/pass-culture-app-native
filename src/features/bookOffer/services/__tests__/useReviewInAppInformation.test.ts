import mockdate from 'mockdate'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { storage } from 'libs/storage'
import { renderHook } from 'tests/utils'

const dateNow = 1634806274417
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000

describe('useReviewInAppInformation', () => {
  beforeEach(() => {
    mockdate.set(new Date(dateNow))
    jest.clearAllMocks()
    storage.saveObject('first_time_review_has_been_requested', dateNow)
  })

  it('should return shouldReviewBeRequested = true if review Modal has not been seen', async () => {
    const { result } = await renderHook(useReviewInAppInformation)
    expect(result.current.shouldReviewBeRequested).toBeTruthy()
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen three times', async () => {
    storage.saveObject('times_review_has_been_requested', 3)
    const { result } = await renderHook(useReviewInAppInformation)
    expect(result.current.shouldReviewBeRequested).toBeTruthy()
  })

  it('should return shouldReviewBeRequested = false if review Modal has been seen more than three times', async () => {
    storage.saveObject('times_review_has_been_requested', 4)
    const { result } = await renderHook(useReviewInAppInformation)
    expect(result.current.shouldReviewBeRequested).toBeFalsy()
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen more than three times but one year ago', async () => {
    storage.saveObject('times_review_has_been_requested', 4)
    storage.saveObject('first_time_review_has_been_requested', dateNow - ONE_YEAR - 1)
    const { result } = await renderHook(useReviewInAppInformation)
    expect(result.current.shouldReviewBeRequested).toBeTruthy()
  })
})
