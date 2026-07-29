import { Bookability, Screening } from 'api/gen'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
import {
  getEventCardIsEnabled,
  getEventCardLeftSubtitle,
  getEventCardRightSubtitle,
} from 'features/offer/components/OfferEventCardList/OfferEventCardListV2'
import { Currency } from 'shared/currency/useGetCurrencyToDisplay'
import { DEFAULT_PACIFIC_FRANC_TO_EURO_RATE } from 'shared/exchangeRates/defaultRateValues'

jest.mock('features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar')
jest.mock('features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings')
jest.mock('features/offer/components/OfferCTAButton/useOfferCTAButton')
jest.mock('libs/subcategories')
jest.mock('libs/firebase/analytics/analytics')

describe('OfferEventCardListV2', () => {
  it.each`
    bookability                                          | expectedIsEnabled | status
    ${Bookability.BOOKABLE}                              | ${true}           | ${'enabled'}
    ${Bookability.AUTHENTICATION_REQUIRED}               | ${true}           | ${'enabled'}
    ${Bookability.FINISH_SUBSCRIPTION_REQUIRED}          | ${true}           | ${'enabled'}
    ${Bookability.USER_APPLICATION_STILL_PROCESSING}     | ${true}           | ${'enabled'}
    ${Bookability.USER_HAS_APPLICATION_ERROR}            | ${true}           | ${'enabled'}
    ${Bookability.STOCK_BOOKING_IS_DISABLED}             | ${false}          | ${'disabled'}
    ${Bookability.STOCK_IS_SOLD_OUT}                     | ${false}          | ${'disabled'}
    ${Bookability.USER_CANNOT_BOOK}                      | ${false}          | ${'disabled'}
    ${Bookability.USER_HAS_ALREADY_BOOKED_OFFER}         | ${false}          | ${'disabled'}
    ${Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER} | ${false}          | ${'disabled'}
    ${Bookability.USER_HAS_INSUFFICIENT_CREDIT}          | ${false}          | ${'disabled'}
  `(
    'should display a $status event card for "$bookability" bookability',
    ({ bookability, expectedIsEnabled }) => {
      const beginningDatetime = new Date().toISOString()
      const screening = {
        beginningDatetime: beginningDatetime,
        bookability: bookability,
        features: [],
        price: 5,
        stockId: 1,
      } as Screening
      const eventCardIsEnabled = getEventCardIsEnabled(screening)

      expect(eventCardIsEnabled).toEqual(expectedIsEnabled)
    }
  )

  it.each`
    bookability                                  | expectedText
    ${Bookability.STOCK_BOOKING_IS_DISABLED}     | ${EventCardSubtitleEnum.UNAVAILABLE}
    ${Bookability.STOCK_IS_SOLD_OUT}             | ${EventCardSubtitleEnum.FULLY_BOOKED}
    ${Bookability.USER_HAS_ALREADY_BOOKED_OFFER} | ${EventCardSubtitleEnum.ALREADY_BOOKED}
    ${Bookability.USER_HAS_INSUFFICIENT_CREDIT}  | ${EventCardSubtitleEnum.NOT_ENOUGH_CREDIT}
    ${Bookability.USER_CANNOT_BOOK}              | ${EventCardSubtitleEnum.UNAVAILABLE}
  `(
    'should display "$expectedText" as event card left subtitle for "$bookability" bookability',
    ({ bookability, expectedText }) => {
      const screening = {
        beginningDatetime: new Date().toISOString(),
        bookability: bookability,
        features: [],
        price: 5,
        stockId: 1,
      }
      const eventCardLeftSubtitle = getEventCardLeftSubtitle(screening)

      expect(eventCardLeftSubtitle).toEqual(expectedText)
    }
  )

  it.each`
    bookability
    ${Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER}
    ${Bookability.FINISH_SUBSCRIPTION_REQUIRED}
    ${Bookability.USER_APPLICATION_STILL_PROCESSING}
    ${Bookability.USER_HAS_APPLICATION_ERROR}
    ${Bookability.AUTHENTICATION_REQUIRED}
    ${Bookability.BOOKABLE}
  `(
    'should display features as event card left subtitle for "$bookability" bookability',
    ({ bookability }) => {
      const screening = {
        beginningDatetime: new Date().toISOString(),
        bookability: bookability,
        features: ['FR', 'ICE'],
        price: 5,
        stockId: 1,
      }
      const eventCardLeftSubtitle = getEventCardLeftSubtitle(screening)

      expect(eventCardLeftSubtitle).toEqual('FR, ICE')
    }
  )

  it.each`
    bookability
    ${Bookability.AUTHENTICATION_REQUIRED}
    ${Bookability.BOOKABLE}
    ${Bookability.USER_HAS_ALREADY_BOOKED_RELATED_OFFER}
  `('should display price as event card right subtitle for $bookability', ({ bookability }) => {
    const screening = {
      beginningDatetime: new Date().toISOString(),
      bookability: bookability,
      features: ['FR', 'ICE'],
      price: 5,
      stockId: 1,
    }
    const eventCardRightSubtitle = getEventCardRightSubtitle(
      screening,
      Currency.EURO,
      DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
    )

    expect(eventCardRightSubtitle).toEqual('5\u00a0€')
  })

  it.each`
    bookability
    ${Bookability.FINISH_SUBSCRIPTION_REQUIRED}
    ${Bookability.STOCK_BOOKING_IS_DISABLED}
    ${Bookability.STOCK_IS_SOLD_OUT}
    ${Bookability.USER_APPLICATION_STILL_PROCESSING}
    ${Bookability.USER_CANNOT_BOOK}
    ${Bookability.USER_HAS_ALREADY_BOOKED_OFFER}
    ${Bookability.USER_HAS_APPLICATION_ERROR}
    ${Bookability.USER_HAS_INSUFFICIENT_CREDIT}
  `('should display empty event card right subtitle for $bookability', ({ bookability }) => {
    const screening = {
      beginningDatetime: new Date().toISOString(),
      bookability: bookability,
      features: ['FR', 'ICE'],
      price: 5,
      stockId: 1,
    }
    const eventCardRightSubtitle = getEventCardRightSubtitle(
      screening,
      Currency.EURO,
      DEFAULT_PACIFIC_FRANC_TO_EURO_RATE
    )

    expect(eventCardRightSubtitle).toEqual('')
  })
})
