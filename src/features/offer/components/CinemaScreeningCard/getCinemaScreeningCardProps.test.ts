import { Bookability, ScreeningV2 } from 'api/gen'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'

import {
  getCinemaScreeningCardDisabledReason,
  getCinemaScreeningCardProps,
} from './getCinemaScreeningCardProps'
import { CinemaScreeningCardDisabledReason } from './types'

const screening: ScreeningV2 = {
  beginningDatetime: '2026-10-27T14:30:00+01:00',
  bookability: Bookability.BOOKABLE,
  features: {
    accessibility: { audio: ['CCAP'], mental: [], motor: ['PMR'], visual: ['GRETA'] },
    audio: 'DOLBY_ATMOS',
    language: 'VF',
    specialEventType: 'PREVIEW_SCREENING_WITH_CREW',
    video: 'IMAX',
  },
  price: 10.5,
  stockId: 123,
}

describe('getCinemaScreeningCardProps', () => {
  it('adapts structured screening information to the cinema card', () => {
    const onPress = jest.fn()

    expect(getCinemaScreeningCardProps(screening, onPress, Currency.EURO, 119.33)).toEqual({
      accessibility: screening.features.accessibility,
      audio: ['DolbyAtmos'],
      languages: ['VF'],
      onPress,
      price: '10,50 €',
      specialEvent: 'Avant première',
      time: '14h30',
      video: ['IMAX'],
    })
  })

  it.each([
    [Bookability.STOCK_IS_SOLD_OUT, CinemaScreeningCardDisabledReason.FULLY_BOOKED],
    [Bookability.USER_HAS_ALREADY_BOOKED_OFFER, CinemaScreeningCardDisabledReason.ALREADY_BOOKED],
    [
      Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER,
      CinemaScreeningCardDisabledReason.ALREADY_BOOKED,
    ],
    [
      Bookability.USER_HAS_INSUFFICIENT_CREDIT,
      CinemaScreeningCardDisabledReason.INSUFFICIENT_CREDIT,
    ],
    [Bookability.STOCK_BOOKING_IS_DISABLED, CinemaScreeningCardDisabledReason.UNAVAILABLE],
    [Bookability.USER_CANNOT_BOOK, CinemaScreeningCardDisabledReason.UNAVAILABLE],
    [Bookability.BOOKABLE, undefined],
    [Bookability.AUTHENTICATION_REQUIRED, undefined],
  ])('maps %s to the expected disabled reason', (bookability, expected) => {
    expect(getCinemaScreeningCardDisabledReason(bookability)).toBe(expected)
  })
})
