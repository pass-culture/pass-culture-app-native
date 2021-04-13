import React from 'react'
import waitForExpect from 'wait-for-expect'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { analytics } from 'libs/analytics'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { fireEvent, render } from 'tests/utils'

import { BookingConfirmation } from '../BookingConfirmation'

jest.mock('features/home/services/useAvailableCredit', () => ({
  useAvailableCredit: jest.fn(() => ({ isExpired: false, amount: 2000 })),
}))

describe('<BookingConfirmation />', () => {
  const mockOfferId = 1337
  beforeEach(() => {
    useRoute.mockImplementation(() => ({
      params: {
        offerId: mockOfferId,
        bookingId: 345,
      },
    }))
  })
  afterEach(jest.clearAllMocks)

  it('should render correctly', () => {
    const page = render(reactQueryProviderHOC(<BookingConfirmation />))
    expect(page).toMatchSnapshot()
  })

  it('should go to Bookings and log analytics event', async () => {
    const renderAPI = render(reactQueryProviderHOC(<BookingConfirmation />))
    fireEvent.press(renderAPI.getByText('Voir ma réservation'))
    await waitForExpect(() => {
      expect(analytics.logSeeMyBooking).toBeCalledWith(mockOfferId)
      expect(navigate).toBeCalledWith('BookingDetails', {
        id: 345,
        shouldFetchAll: true,
      })
    })
  })
})
