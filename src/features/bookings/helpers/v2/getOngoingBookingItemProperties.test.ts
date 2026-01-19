import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { getOngoingBookingItemProperties } from 'features/bookings/helpers/v2/getOngoingBookingItemProperties'
import { analytics } from 'libs/analytics/provider'

jest.mock('libs/analytics/provider', () => ({
  analytics: {
    logViewedBookingPage: jest.fn(),
  },
}))

describe('getOngoingBookingItemProperties', () => {
  const booking = bookingsSnapV2.ongoingBookings[0]
  const eligibleBookingsForArchive = [booking]

  it('should return all formatting properties for the booking item', () => {
    const isEvent = false

    const properties = getOngoingBookingItemProperties({
      booking,
      isEvent,
      eligibleBookingsForArchive,
    })

    expect(properties).toEqual({
      accessibilityLabel: expect.any(String),
      canDisplayExpirationMessage: expect.any(Boolean),
      correctExpirationMessages: expect.any(String),
      daysLeft: expect.any(Number),
      dateLabel: expect.any(String),
      isBookingValid: expect.any(Boolean),
      isDuo: expect.any(Boolean),
      withdrawLabel: expect.any(String),
      onBeforeNavigate: expect.any(Function),
      navigateTo: {
        screen: 'BookingDetails',
        params: { id: booking.id },
      },
    })
  })

  it('should correctly format navigateTo params', () => {
    const properties = getOngoingBookingItemProperties({
      booking,
      isEvent: false,
      eligibleBookingsForArchive: [],
    })

    expect(properties.navigateTo).toEqual({
      screen: 'BookingDetails',
      params: { id: booking.id },
    })
  })

  it('should call analytics with correct parameters in onBeforeNavigate', async () => {
    const properties = getOngoingBookingItemProperties({
      booking,
      isEvent: false,
      eligibleBookingsForArchive: [],
    })

    await properties.onBeforeNavigate()

    expect(analytics.logViewedBookingPage).toHaveBeenNthCalledWith(1, {
      offerId: booking.stock.offer.id,
      from: 'bookings',
    })
  })
})
