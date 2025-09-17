import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { findOngoingOrEndedBooking } from 'features/bookings/queries/selectors/findOngoingOrEndedBooking'

describe('findOngoingOrEndedBooking', () => {
  it('should filter on ongoingBookings and return the corresponding booking', () => {
    const firstOngoingBooking = bookingsSnapV2.ongoingBookings[0]

    const result = findOngoingOrEndedBooking(bookingsSnapV2, firstOngoingBooking.id)

    expect(result).toEqual(firstOngoingBooking)
  })

  it('should filter on endedBookings and return the corresponding booking', () => {
    const firstEndedBooking = bookingsSnapV2.endedBookings[0]

    const result = findOngoingOrEndedBooking(bookingsSnapV2, firstEndedBooking.id)

    expect(result).toEqual(firstEndedBooking)
  })

  it('should return null when booking id is not found', () => {
    const result = findOngoingOrEndedBooking(bookingsSnapV2, 999_999)

    expect(result).toBeNull()
  })

  it('should return null when bookings response is null', () => {
    const result = findOngoingOrEndedBooking(null, 123)

    expect(result).toBeNull()
  })
})
