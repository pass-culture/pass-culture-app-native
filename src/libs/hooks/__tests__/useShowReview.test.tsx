import React from 'react'
import InAppReview from 'react-native-in-app-review'
import waitForExpect from 'wait-for-expect'

import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import * as disableStoreReview from 'libs/firebase/firestore/featureFlags/disableStoreReview'
import { useShowReview } from 'libs/hooks/useShowReview'
import { render } from 'tests/utils'

const disableStoreReviewSpy = jest.spyOn(disableStoreReview, 'useDisableStoreReview')

jest.mock('react-native-in-app-review')
const mockIsAvailable = InAppReview.isAvailable as jest.Mock
const mockRequestInAppReview = InAppReview.RequestInAppReview as jest.Mock

jest.mock('features/bookOffer/services/useReviewInAppInformation')
const mockUseReviewInAppInformation = useReviewInAppInformation as jest.Mock

const mockUpdateInformationWhenReviewHasBeenRequested = jest.fn()

const TestReviewComponent = () => {
  useShowReview()
  return null
}

describe('useShowReview', () => {
  beforeAll(() => {
    jest.useFakeTimers()
  })
  afterEach(() => {
    jest.runOnlyPendingTimers()
  })
  afterAll(() => {
    jest.useRealTimers()
  })

  it('should show the review when it is available and we want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
    mockRequestInAppReview.mockResolvedValueOnce(undefined)

    render(<TestReviewComponent />)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).toHaveBeenCalledTimes(1)
  })

  it('should not show the review when it is not available ', () => {
    mockIsAvailable.mockReturnValueOnce(false)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })

    render(<TestReviewComponent />)

    jest.advanceTimersByTime(3000)

    expect(mockRequestInAppReview).not.toHaveBeenCalled()
  })

  it('should not show the review when we dont want to show it', () => {
    mockIsAvailable.mockReturnValueOnce(true)
    mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: false })

    render(<TestReviewComponent />)

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

    render(<TestReviewComponent />)

    jest.advanceTimersByTime(3000)

    await waitForExpect(() => {
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

    render(<TestReviewComponent />)

    jest.advanceTimersByTime(3000)

    await waitForExpect(() => {
      expect(mockUpdateInformationWhenReviewHasBeenRequested).not.toHaveBeenCalled()
    })
  })

  describe('FF disableStoreReview', () => {
    beforeEach(() => {
      mockIsAvailable.mockReturnValueOnce(true)
      mockUseReviewInAppInformation.mockReturnValueOnce({ shouldReviewBeRequested: true })
      mockRequestInAppReview.mockResolvedValueOnce(undefined)
    })

    it('should not show the review when we disabled store review', () => {
      disableStoreReviewSpy.mockReturnValueOnce(false)

      render(<TestReviewComponent />)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).toHaveBeenCalledWith()
    })

    it('should not show review when we enabled store review', () => {
      disableStoreReviewSpy.mockReturnValueOnce(true)

      render(<TestReviewComponent />)

      jest.advanceTimersByTime(3000)

      expect(mockRequestInAppReview).not.toHaveBeenCalled()
    })
  })
})
