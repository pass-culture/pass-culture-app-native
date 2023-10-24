import { AppState } from 'react-native'
import InAppReview from 'react-native-in-app-review'

import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useShowReview } from 'libs/hooks/useShowReview'
import { renderHook, waitFor } from 'tests/utils'

const useFeatureFlagSpy = jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(false)

jest.unmock('libs/appState')
const appStateSpy = jest.spyOn(AppState, 'addEventListener')

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.mock('features/bookOffer/helpers/useReviewInAppInformation')
const mockUseReviewInAppInformation = useReviewInAppInformation as jest.Mock

const mockUpdateInformationWhenReviewHasBeenRequested = jest.fn()

jest.useFakeTimers({ legacyFakeTimers: true })

describe('useShowReview', () => {
  it('should show the review when it is available and we want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
    mockRequestInAppReview.mockResolvedValueOnce(undefined)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  it('should not show the review when it is not available', () => {
    mockIsAvailable.mockReturnValueOnce(false)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should not show the review when we dont want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: false })

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should update information if the review ends successfully', async () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({
      shouldReviewBeRequested: true,
      updateInformationWhenReviewHasBeenRequested: mockUpdateInformationWhenReviewHasBeenRequested,
    })
    mockRequestInAppReview.mockResolvedValueOnce(true)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    await waitFor(() => {
      expect(mockUpdateInformationWhenReviewHasBeenRequested).toHaveBeenCalledTimes(1)
    })
  })

  it('should not update information if the review doesnt end successfully', async () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({
      shouldReviewBeRequested: true,
      updateInformationWhenReviewHasBeenRequested: mockUpdateInformationWhenReviewHasBeenRequested,
    })
    mockRequestInAppReview.mockResolvedValueOnce(false)

    renderHook(useShowReview)

    jest.advanceTimersByTime(3000)

    expect(mockUpdateInformationWhenReviewHasBeenRequested).not.toHaveBeenCalled()
  })

  describe('FF disableStoreReview', () => {
    beforeEach(() => {
      mockIsAvailable.mockReturnValueOnce(true)
      mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
      mockRequestInAppReview.mockResolvedValueOnce(undefined)
    })

    it('should show the review when we enable store review', () => {
      useFeatureFlagSpy.mockReturnValueOnce(false)

      renderHook(useShowReview)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
    })

    it('should not show the review when app is running in the background', () => {
      useFeatureFlagSpy.mockReturnValueOnce(false)

      renderHook(useShowReview)

      const mockCurrentAppState = appStateSpy.mock.calls[0][1]
      mockCurrentAppState('active')
      mockCurrentAppState('background')
      jest.advanceTimersByTime(3000)

      expect(clearTimeout).toHaveBeenCalledTimes(1)
      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })

    it('should not show review when we disable store review', () => {
      useFeatureFlagSpy.mockReturnValueOnce(true)

      renderHook(useShowReview)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })
  })
})
