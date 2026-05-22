import InAppReview from 'react-native-in-app-review'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import {
  consumeCreditReviewEligibility,
  CREDIT_REVIEW_ELIGIBLE_KEY,
  resetCreditReviewTrigger,
} from 'libs/reviewInApp/creditReviewTrigger'
import { clearHistory } from 'libs/reviewInApp/reviewHistory'
import { useCreditReviewTrigger } from 'libs/reviewInApp/useCreditReviewTrigger'
import { storage } from 'libs/storage'
import { act, renderHook, waitFor } from 'tests/utils'

jest.unmock('libs/appState')
jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

// Run the focus callback once on mount (mimics a focus event) and its cleanup on unmount.
jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) =>
    jest.requireActual('react').useEffect(callback, []),
}))

jest.useFakeTimers()

const flushAsync = () => act(async () => {})

describe('useCreditReviewTrigger', () => {
  beforeEach(async () => {
    await resetCreditReviewTrigger()
    await clearHistory()
    mockIsAvailable.mockReturnValue(true)
    mockRequestInAppReview.mockResolvedValue(true)
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_REVIEW_TRIGGER_CREDIT])
  })

  it('requests a review when the user is eligible', async () => {
    await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)

    renderHook(() => useCreditReviewTrigger())
    await flushAsync()
    jest.advanceTimersByTime(1000)
    await flushAsync()

    await waitFor(() => {
      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })
  })

  it('does not request a review when the user is not eligible', async () => {
    renderHook(() => useCreditReviewTrigger())
    await flushAsync()
    jest.advanceTimersByTime(1000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('consumes the eligibility flag so the prompt is shown only once', async () => {
    await storage.saveObject(CREDIT_REVIEW_ELIGIBLE_KEY, true)

    renderHook(() => useCreditReviewTrigger())
    await flushAsync()
    jest.advanceTimersByTime(1000)
    await flushAsync()

    expect(await consumeCreditReviewEligibility()).toBe(false)
  })
})
