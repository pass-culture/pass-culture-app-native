import React from 'react'
import waitForExpect from 'wait-for-expect'

import { reset, useRoute } from '__mocks__/@react-navigation/native'
import reactNativeInAppReview from '__mocks__/react-native-in-app-review'
import { useReviewInAppInformation } from 'features/bookOffer/services/useReviewInAppInformation'
import { analytics } from 'libs/analytics'
import { fireEvent, render } from 'tests/utils'

import { BookingConfirmation } from '../BookingConfirmation'

jest.mock('features/home/services/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

jest.mock('features/bookOffer/services/useReviewInAppInformation', () => ({
  useReviewInAppInformation: jest.fn(() => ({
    shouldReviewBeRequested: true,
    updateInformationWhenReviewHasBeenRequested: jest.fn(),
  })),
}))

const useReviewInAppInformationMock = useReviewInAppInformation as jest.Mock

jest.mock('react-query')

const isAvailable = jest.spyOn(reactNativeInAppReview, 'isAvailable').mockImplementation(() => true)

describe('<BookingConfirmation />', () => {
  const mockOfferId = 1337
  beforeEach(() => {
    jest.useFakeTimers()
    useRoute.mockImplementation(() => ({
      params: {
        offerId: mockOfferId,
        bookingId: 345,
      },
    }))
  })
  afterEach(() => {
    jest.useRealTimers()
  })

  it('should render correctly', () => {
    const page = render(<BookingConfirmation />)
    expect(page).toMatchSnapshot()
  })

  it('should go to Bookings and log analytics event', async () => {
    const renderAPI = render(<BookingConfirmation />)
    fireEvent.press(renderAPI.getByText('Voir ma réservation'))
    await waitForExpect(() => {
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

  it('should call InAppReview Modal after 3 seconds if isAvailable and rules are respected', async () => {
    const requestInAppReview = jest
      .spyOn(reactNativeInAppReview, 'RequestInAppReview')
      .mockResolvedValue(() => true)

    render(<BookingConfirmation />)
    jest.advanceTimersByTime(3000)
    expect(requestInAppReview).toHaveBeenCalled()
  })

  it('should not call InAppReview Modal if isAvailable is false', async () => {
    isAvailable.mockImplementationOnce(() => false)
    const requestInAppReview = jest.spyOn(reactNativeInAppReview, 'RequestInAppReview')

    render(<BookingConfirmation />)
    jest.advanceTimersByTime(3000)
    expect(requestInAppReview).toHaveBeenCalledTimes(0)
  })

  it('should not call InAppReview Modal if isAvailable is true and rules are not respected', async () => {
    const requestInAppReview = jest.spyOn(reactNativeInAppReview, 'RequestInAppReview')
    useReviewInAppInformationMock.mockImplementationOnce(() => ({ shouldReviewBeRequested: false }))

    render(<BookingConfirmation />)
    jest.advanceTimersByTime(3000)
    expect(requestInAppReview).toHaveBeenCalledTimes(0)
  })
})
