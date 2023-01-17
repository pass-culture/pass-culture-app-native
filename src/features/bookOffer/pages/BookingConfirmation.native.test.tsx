import React from 'react'
import { Share } from 'react-native'

import { reset, useRoute } from '__mocks__/@react-navigation/native'
import reactNativeInAppReview from '__mocks__/react-native-in-app-review'
import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { analytics } from 'libs/firebase/analytics'
import { BatchUser } from 'libs/react-native-batch'
import { act, fireEvent, render, waitFor } from 'tests/utils'

import { BookingConfirmation } from './BookingConfirmation'

jest.mock('react-query')
jest.mock('features/offer/api/useOffer')

jest.mock('features/user/helpers/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

jest.mock('features/bookOffer/services/useReviewInAppInformation', () => ({
  useReviewInAppInformation: jest.fn(() => ({
    shouldReviewBeRequested: true,
    updateInformationWhenReviewHasBeenRequested: jest.fn(),
  })),
}))

const mockShare = jest
  .spyOn(Share, 'share')
  .mockResolvedValue({ action: Share.sharedAction, activityType: 'copy' })

const useReviewInAppInformationMock = useReviewInAppInformation as jest.Mock

const isAvailable = jest.spyOn(reactNativeInAppReview, 'isAvailable')
const requestInAppReview = jest.spyOn(reactNativeInAppReview, 'RequestInAppReview')

const mockOfferId = 1337

describe('<BookingConfirmation />', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    useRoute.mockReturnValue({
      params: {
        offerId: mockOfferId,
        bookingId: 345,
      },
    })
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render correctly', () => {
    const page = render(<BookingConfirmation />)
    expect(page).toMatchSnapshot()
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
      const { getByText } = render(<BookingConfirmation />)

      await act(async () => {
        const shareButton = getByText('Partager l’offre')
        fireEvent.press(shareButton)
      })

      expect(mockShare).toHaveBeenCalledTimes(1)
    })

    it('should go to Bookings and log analytics event', async () => {
      const renderAPI = render(<BookingConfirmation />)
      fireEvent.press(renderAPI.getByText('Voir ma réservation'))

      await waitFor(() => {
        expect(analytics.logSeeMyBooking).toBeCalledWith(mockOfferId)
        expect(reset).toBeCalledWith({
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

    it.each(['Voir ma réservation', "Retourner à l'accueil"])(
      'should track Batch event when button is clicked',
      async (buttonWording) => {
        const { getByText } = render(<BookingConfirmation />)

        fireEvent.press(getByText(buttonWording))

        expect(BatchUser.trackEvent).toBeCalledWith('has_booked')
      }
    )
  })
})
