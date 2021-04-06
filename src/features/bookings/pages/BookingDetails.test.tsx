import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { CategoryType } from 'api/gen'
import * as Queries from 'features/bookings/api/queries'
import { render } from 'tests/utils'

import { bookingsSnap } from '../api/bookingsSnap'
import { Booking } from '../components/types'

import { BookingDetails } from './BookingDetails'

jest.mock('features/home/api', () => ({
  useUserProfileInfo: jest.fn(() => ({ data: undefined })),
}))

describe('BookingDetails', () => {
  afterEach(jest.restoreAllMocks)

  beforeAll(() => {
    useRoute.mockImplementation(() => ({
      params: {
        id: 456,
      },
    }))
  })
  describe('Offer rules', () => {
    it('should display rules for a digital offer', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = true

      const { getByText } = renderBookingDetails(booking)

      getByText(
        'Ce code à 6 caractères est ta preuve d’achat ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    })
    it.each([
      [
        'event',
        (booking: Booking) => (booking.stock.offer.category.categoryType = CategoryType.Event),
      ],
      [
        'physical',
        (booking: Booking) => (booking.stock.offer.category.categoryType = CategoryType.Thing),
      ],
    ])('should display rules for a %s offer', (type, prepareBooking) => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      prepareBooking(booking)

      const { getByText } = renderBookingDetails(booking)

      getByText(
        'Tu dois présenter ta carte d’identité et ce code de 6 caractères pour profiter de ta réservation ! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'
      )
    })
  })
})

function renderBookingDetails(booking: Booking) {
  jest.spyOn(Queries, 'useOngoingBooking').mockReturnValue(booking)
  return render(<BookingDetails />)
}
