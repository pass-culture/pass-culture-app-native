import { renderHook } from '@testing-library/react-hooks'
import mockdate from 'mockdate'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { storage } from 'libs/storage'
import { waitFor } from 'tests/utils'

mockdate.set(new Date(1634806274417))

const ONE_YEAR = 365 * 24 * 60 * 60 * 1000
const firstTimeReviewLessThanOneYearAgo = storage.saveObject(
  'first_time_review_has_been_requested',
  1634806275417
)
const firstTimeReviewOneYearAgo = storage.saveObject(
  'first_time_review_has_been_requested',
  1634806275417 + ONE_YEAR
)

describe('useReviewInAppInformation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    firstTimeReviewLessThanOneYearAgo
  })

  it('should return shouldReviewBeRequested = true if review Modal has not been seen', async () => {
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen once', async () => {
    storage.saveObject('times_review_has_been_requested', 1)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen twice', async () => {
    storage.saveObject('times_review_has_been_requested', 2)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen three times', async () => {
    storage.saveObject('times_review_has_been_requested', 3)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })

  it('should return shouldReviewBeRequested = false if review Modal has been seen more than three times', async () => {
    storage.saveObject('times_review_has_been_requested', 4)
    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeFalsy()
    })
  })

  it('should return shouldReviewBeRequested = true if review Modal has been seen more than three times but one year ago', async () => {
    storage.saveObject('times_review_has_been_requested', 4)
    firstTimeReviewOneYearAgo

    const { result } = renderHook(() => useReviewInAppInformation())
    await waitFor(() => {
      expect(result.current.shouldReviewBeRequested).toBeTruthy()
    })
  })
})
