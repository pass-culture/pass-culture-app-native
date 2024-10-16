import React from 'react'
import { Share } from 'react-native'

import { reset, useRoute } from '__mocks__/@react-navigation/native'
import reactNativeInAppReview from '__mocks__/react-native-in-app-review'
import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { analytics } from 'libs/analytics'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { BatchUser } from 'libs/react-native-batch'
import { act, fireEvent, render, screen, waitFor } from 'tests/utils'

import { BookingConfirmation } from './BookingConfirmation'

jest.mock('react-native/Libraries/Animated/animations/TimingAnimation.js')

jest.mock('features/offer/api/useOffer')

jest.mock('shared/user/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

jest.mock('features/bookOffer/helpers/useReviewInAppInformation', () => ({
  useReviewInAppInformation: jest.fn(() => ({
    shouldReviewBeRequested: true,
    updateInformationWhenReviewHasBeenRequested: jest.fn(),
  })),
}))

// Mock for WIP_DISABLE_STORE_REVIEW feature flag
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const share = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const useReviewInAppInformationMock = useReviewInAppInformation as jest.Mock

const isAvailable = jest.spyOn(reactNativeInAppReview, 'isAvailable')
const requestInAppReview = jest.spyOn(reactNativeInAppReview, 'RequestInAppReview')

const mockOfferId = 1337

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('<BookingConfirmation />', () => {
  beforeEach(() => {
    useRoute.mockReturnValue({
      params: {
        offerId: mockOfferId,
        bookingId: 345,
      },
    })
  })

  it('should render correctly', () => {
    render(<BookingConfirmation />)

    expect(screen).toMatchSnapshot()
  })

  describe('InAppReview', () => {
    it('should call InAppReview Modal after 3 seconds if isAvailable and rules are respected', () => {
      isAvailable.mockReturnValueOnce(true)
      requestInAppReview.mockResolvedValueOnce(true)

      render(<BookingConfirmation />)
      jest.advanceTimersByTime(3000)

      expect(requestInAppReview).toHaveBeenCalledTimes(1)
    })

    it('should not call InAppReview Modal if isAvailable is false', () => {
      isAvailable.mockReturnValueOnce(false)

      render(<BookingConfirmation />)
      jest.advanceTimersByTime(3000)

      expect(requestInAppReview).not.toHaveBeenCalled()
    })

    it('should not call InAppReview Modal if isAvailable is true and rules are not respected', () => {
      useReviewInAppInformationMock.mockReturnValueOnce(() => ({
        shouldReviewBeRequested: false,
      }))

      render(<BookingConfirmation />)
      jest.advanceTimersByTime(3000)

      expect(requestInAppReview).not.toHaveBeenCalled()
    })
  })

  describe('buttons', () => {
    it('should call display share when press share button', async () => {
      render(<BookingConfirmation />)

      await act(async () => {
        const shareButton = await screen.findByText('Partager l’offre')
        fireEvent.press(shareButton)
      })

      expect(share).toHaveBeenCalledTimes(1)
    })

    it('should log analytics when press share button', async () => {
      render(<BookingConfirmation />)

      await act(async () => {
        const shareButton = screen.getByText('Partager l’offre')
        fireEvent.press(shareButton)
      })

      expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
        type: 'Offer',
        from: 'bookingconfirmation',
        offerId: mockOfferId,
      })
    })

    it('should go to Bookings and log analytics event', async () => {
      render(<BookingConfirmation />)
      fireEvent.press(screen.getByText('Voir ma réservation'))

      await waitFor(() => {
        expect(analytics.logSeeMyBooking).toHaveBeenCalledWith(mockOfferId)
        expect(reset).toHaveBeenCalledWith({
          index: 1,
          routes: [
            {
              name: 'TabNavigator',
              state: {
                routes: [{ name: 'Bookings' }],
                index: 0,
              },
            },
            {
              name: 'BookingDetails',
              params: {
                id: 345,
              },
            },
          ],
        })
      })
    })

    it.each(['Voir ma réservation', 'Retourner à l’accueil'])(
      'should track Batch event when button is clicked',
      async (buttonWording) => {
        render(<BookingConfirmation />)

        fireEvent.press(screen.getByText(buttonWording))

        expect(BatchUser.trackEvent).toHaveBeenCalledWith('has_booked')
      }
    )
  })
})
