import { bookingFixture } from 'features/bookings/fixtures/bookingsSnap'

import { firstSessionAfterBookingTrigger } from './firstSessionAfterBookingTrigger'

describe('First session after booking trigger', () => {
  it('should be true when first session after last booking was consumed', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const dateUsed = new Date('2024-07-26T12:00:00').toISOString()
    const shouldTrigger = firstSessionAfterBookingTrigger({
      currentDate,
      ongoingBookings: [{ ...bookingFixture, dateUsed }],
    })()

    expect(shouldTrigger).toBe(true)
  })

  it('should be false when last booking was NOT consumed', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const dateUsed = undefined
    const shouldTrigger = firstSessionAfterBookingTrigger({
      currentDate,
      ongoingBookings: [{ ...bookingFixture, dateUsed }],
    })()

    expect(shouldTrigger).toBe(false)
  })
})
