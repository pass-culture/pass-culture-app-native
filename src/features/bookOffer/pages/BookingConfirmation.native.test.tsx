import React from 'react'
import { Share } from 'react-native'

import { reset, useRoute } from '__mocks__/@react-navigation/native'
import reactNativeInAppReview from '__mocks__/react-native-in-app-review'
import { useReviewInAppInformation } from 'features/bookOffer/helpers/useReviewInAppInformation'
import { analytics } from 'libs/analytics'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { BatchProfile } from 'libs/react-native-batch'
import { act, render, screen, userEvent } from 'tests/utils'

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

const share = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const useReviewInAppInformationMock = useReviewInAppInformation as jest.Mock

const isAvailable = jest.spyOn(reactNativeInAppReview, 'isAvailable')
const requestInAppReview = jest.spyOn(reactNativeInAppReview, 'RequestInAppReview')

const mockOfferId = 1337

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')

describe('<BookingConfirmation />', () => {
  beforeEach(() => {
    setFeatureFlags()
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
        await userEvent.press(shareButton)
      })

      expect(share).toHaveBeenCalledTimes(1)
    })

    it('should log analytics when press share button', async () => {
      render(<BookingConfirmation />)

      await act(async () => {
        const shareButton = await screen.findByText('Partager l’offre')
        await userEvent.press(shareButton)
      })

      expect(analytics.logShare).toHaveBeenNthCalledWith(1, {
        type: 'Offer',
        from: 'bookingconfirmation',
        offerId: mockOfferId,
      })
    })

    it('should go to Bookings when click on CTA', async () => {
      render(<BookingConfirmation />)
      await userEvent.press(await screen.findByText('Voir ma réservation'))

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

    it('should log analytic logSeeMyBooking when click on CTA', async () => {
      render(<BookingConfirmation />)
      await userEvent.press(await screen.findByText('Voir ma réservation'))

      expect(analytics.logSeeMyBooking).toHaveBeenCalledWith(mockOfferId)
    })

    it('should log analytic logViewedBookingPage when click on CTA', async () => {
      render(<BookingConfirmation />)
      await userEvent.press(await screen.findByText('Voir ma réservation'))

      expect(analytics.logViewedBookingPage).toHaveBeenCalledWith({
        offerId: mockOfferId,
        from: 'bookingconfirmation',
      })
    })

    it.each(['Voir ma réservation', 'Retourner à l’accueil'])(
      'should track Batch event when button is clicked',
      async (buttonWording) => {
        render(<BookingConfirmation />)

        await userEvent.press(await screen.findByText(buttonWording))

        expect(BatchProfile.trackEvent).toHaveBeenCalledWith('has_booked')
      }
    )
  })
})
