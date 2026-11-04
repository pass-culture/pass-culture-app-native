import { StockResponse } from 'api/gen'
import { mockedBookingV2Api } from 'fixtures/booking'

import { getCinemaScreeningCardDisabledReason } from './getCinemaScreeningCardDisabledReason'
import { CinemaScreeningCardDisabledReason } from './types'

const screening: StockResponse = {
  beginningDatetime: '2024-01-01T12:00:00',
  id: 1,
  isBookable: true,
  isExpired: false,
  isForbiddenToUnderage: false,
  isSoldOut: false,
  price: 570,
}

describe('getCinemaScreeningCardDisabledReason', () => {
  it('returns undefined when the screening is bookable', () => {
    expect(getCinemaScreeningCardDisabledReason({ screening, offerVenueId: 1 })).toBeUndefined()
  })

  it.each([
    {
      params: { isExternalBookingsDisabled: true },
      expected: CinemaScreeningCardDisabledReason.UNAVAILABLE,
    },
    {
      params: { screening: { ...screening, isBookable: false } },
      expected: CinemaScreeningCardDisabledReason.UNAVAILABLE,
    },
    {
      params: { screening: { ...screening, isSoldOut: true } },
      expected: CinemaScreeningCardDisabledReason.FULLY_BOOKED,
    },
    {
      params: { movieScreeningUserData: { isUserEligible: false } },
      expected: CinemaScreeningCardDisabledReason.UNAVAILABLE,
    },
    {
      params: {
        screening: {
          ...screening,
          beginningDatetime: mockedBookingV2Api.stock.beginningDatetime,
        },
        movieScreeningUserData: { bookings: mockedBookingV2Api },
      },
      expected: CinemaScreeningCardDisabledReason.ALREADY_BOOKED,
    },
    {
      params: {
        offerVenueId: mockedBookingV2Api.stock.offer.venue.id,
        movieScreeningUserData: { bookings: mockedBookingV2Api, hasBookedOffer: true },
      },
      expected: CinemaScreeningCardDisabledReason.UNAVAILABLE,
    },
    {
      params: {
        movieScreeningUserData: { isUserLoggedIn: true, hasEnoughCredit: false },
      },
      expected: CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT,
    },
  ])('returns $expected for $params', ({ params, expected }) => {
    expect(getCinemaScreeningCardDisabledReason({ screening, offerVenueId: 1, ...params })).toBe(
      expected
    )
  })
})
