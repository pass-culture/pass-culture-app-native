import InAppReview from 'react-native-in-app-review'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  OFFERS_VIEWED_COUNT_STORAGE_KEY,
  readOffersViewedCount,
} from 'libs/reviewInApp/offersViewedCounter'
import { clearHistory } from 'libs/reviewInApp/reviewHistory'
import { OFFERS_VIEWED_REVIEW_THRESHOLD } from 'libs/reviewInApp/types'
import { useOffersViewedReviewTrigger } from 'libs/reviewInApp/useOffersViewedReviewTrigger'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

jest.unmock('libs/appState')
jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.useFakeTimers()

// The hook awaits the persistent counter before scheduling the delayed prompt,
// so we flush pending promises (act) once to reach the setTimeout, then again
// after advancing fake timers to resolve the native call and the counter reset.
const flushAsync = () => act(async () => {})

describe('useOffersViewedReviewTrigger', () => {
  beforeEach(async () => {
    await storage.clear(OFFERS_VIEWED_COUNT_STORAGE_KEY)
    await clearHistory()
    mockIsAvailable.mockReturnValue(true)
    mockRequestInAppReview.mockResolvedValue(true)
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_OFFERS])
  })

  it('does not trigger before the threshold is reached', async () => {
    for (let i = 1; i < OFFERS_VIEWED_REVIEW_THRESHOLD; i++) {
      renderHook(() => useOffersViewedReviewTrigger(i))
      await flushAsync()
    }
    jest.advanceTimersByTime(5000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
    expect(await readOffersViewedCount()).toBe(OFFERS_VIEWED_REVIEW_THRESHOLD - 1)
  })

  it('triggers the review and resets the counter when the threshold is reached', async () => {
    for (let i = 1; i <= OFFERS_VIEWED_REVIEW_THRESHOLD; i++) {
      renderHook(() => useOffersViewedReviewTrigger(i))
      await flushAsync()
    }
    jest.advanceTimersByTime(2000)
    await flushAsync()

    await waitFor(() => {
      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })

    expect(await readOffersViewedCount()).toBe(0)
  })

  it('persists the counter across hook instances', async () => {
    await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, 5)

    for (let i = 6; i <= OFFERS_VIEWED_REVIEW_THRESHOLD; i++) {
      renderHook(() => useOffersViewedReviewTrigger(i))
      await flushAsync()
    }
    jest.advanceTimersByTime(2000)
    await flushAsync()

    await waitFor(() => {
      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })
  })

  it('preserves the counter when the feature flag is off so the signal is not lost', async () => {
    setFeatureFlags([])
    await storage.saveObject(OFFERS_VIEWED_COUNT_STORAGE_KEY, OFFERS_VIEWED_REVIEW_THRESHOLD - 1)

    renderHook(() => useOffersViewedReviewTrigger(42))
    await flushAsync()
    jest.advanceTimersByTime(2000)
    await flushAsync()

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
    expect(await readOffersViewedCount()).toBe(OFFERS_VIEWED_REVIEW_THRESHOLD)
  })

  it('does nothing when offerId is undefined', async () => {
    renderHook(() => useOffersViewedReviewTrigger(undefined))
    await flushAsync()
    jest.advanceTimersByTime(2000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
    expect(await readOffersViewedCount()).toBe(0)
  })
})
