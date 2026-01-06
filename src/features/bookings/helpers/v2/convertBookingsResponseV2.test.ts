import { BookingsResponseV2, BookingsListResponseV2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'

import { convertBookingsResponseV2 } from './convertBookingsResponseV2'

describe('convert BookingsResponseV2 to BookingsListResponseV2', () => {
  it('should convert ongoingBookings', () => {
    const mockResponse: BookingsResponseV2 = {
      ongoingBookings: [bookingsSnapV2.ongoingBookings[0]],
      endedBookings: [],
      hasBookingsAfter18: bookingsSnapV2.hasBookingsAfter18,
    }

    const result = convertBookingsResponseV2(mockResponse, 'ongoingBookings')

    const booking = bookingsSnapV2.ongoingBookings[0]
    const expected: BookingsListResponseV2 = {
      bookings: [
        {
          ...booking,
          activationCode: booking.ticket.activationCode,
          isArchivable: false,
          stock: {
            ...booking.stock,
            offer: {
              ...booking.stock.offer,
              withdrawalType: booking.ticket.withdrawal.type,
              withdrawalDelay: booking.ticket.withdrawal.delay,
              imageUrl: booking.stock.offer.image?.url,
            },
          },
        },
      ],
    }

    expect(result).toEqual(expected)
  })

  it('should convert endedBookings', () => {
    const mockResponse: BookingsResponseV2 = {
      ongoingBookings: [],
      endedBookings: [bookingsSnapV2.endedBookings[0]],
      hasBookingsAfter18: bookingsSnapV2.hasBookingsAfter18,
    }

    const result = convertBookingsResponseV2(mockResponse, 'endedBookings')

    const booking = bookingsSnapV2.endedBookings[0]
    const expected: BookingsListResponseV2 = {
      bookings: [
        {
          ...booking,
          activationCode: booking.ticket.activationCode,
          isArchivable: false,
          stock: {
            ...booking.stock,
            offer: {
              ...booking.stock.offer,
              withdrawalType: booking.ticket.withdrawal.type,
              withdrawalDelay: booking.ticket.withdrawal.delay,
              imageUrl: booking.stock.offer.image?.url,
            },
          },
        },
      ],
    }

    expect(result).toEqual(expected)
  })

  it('should return empty array when no bookings are found', () => {
    const mockResponse: BookingsResponseV2 = {
      ongoingBookings: [],
      endedBookings: [],
      hasBookingsAfter18: false,
    }

    const result = convertBookingsResponseV2(mockResponse, 'ongoingBookings')

    expect(result.bookings).toEqual([])
  })
})
