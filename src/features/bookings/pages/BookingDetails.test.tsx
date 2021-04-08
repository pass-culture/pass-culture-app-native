import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { CategoryNameEnum, CategoryType } from 'api/gen'
import * as Queries from 'features/bookings/api/queries'
import * as NavigationHelpers from 'features/navigation/helpers'
import { fireEvent, render } from 'tests/utils'

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

  describe('<DetailedBookingTicket />', () => {
    it('should display booking token', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      const { getByText } = renderBookingDetails(booking)
      getByText('352UW4')
    })

    it('should display offer link button if offer is digital', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = true
      const { getByText } = renderBookingDetails(booking)
      getByText("Accéder à l'offre")
    })

    it('should open externalTicketOfficeUrl on offer button press', () => {
      const openExternalUrl = jest
        .spyOn(NavigationHelpers, 'openExternalUrl')
        .mockImplementation(jest.fn())
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = true
      booking.stock.offer.externalTicketOfficeUrl = 'http://example.com'

      const { getByText } = renderBookingDetails(booking)
      const offerButton = getByText("Accéder à l'offre")
      fireEvent.press(offerButton)

      expect(openExternalUrl).toHaveBeenCalledWith(booking.stock.offer.externalTicketOfficeUrl)
    })

    it('should display booking qr code if offer is physical', async () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.isDigital = false
      const { getByTestId } = renderBookingDetails(booking)
      getByTestId('qr-code')
    })

    it('should display EAN code if offer is a book (digital or physical)', () => {
      const booking = bookingsSnap.ongoing_bookings[0]
      booking.stock.offer.category.name = CategoryNameEnum.LIVRE
      const { getByText } = renderBookingDetails(booking)
      getByText('123456789')
    })
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
    ])('should display rules for a %s & non-digital offer', (type, prepareBooking) => {
      const booking = { ...bookingsSnap.ongoing_bookings[0] }
      booking.stock.offer.isDigital = false
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
