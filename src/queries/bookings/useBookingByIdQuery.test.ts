import { BookingResponse } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'

import { validateBookingResponse } from './useBookingByIdQuery'

const booking = bookingsSnapV2.ongoingBookings[0]

describe('useBookingByIdQuery', () => {
  it('returns a valid booking response', () => {
    expect(validateBookingResponse(booking, booking.id)).toBe(booking)
  })

  it('throws when booking stock is missing', () => {
    const invalidBooking = {
      ...booking,
      stock: undefined,
    } as unknown as BookingResponse

    expect(() => validateBookingResponse(invalidBooking, booking.id)).toThrow(
      `Invalid booking response for booking #${booking.id}`
    )
  })
})
