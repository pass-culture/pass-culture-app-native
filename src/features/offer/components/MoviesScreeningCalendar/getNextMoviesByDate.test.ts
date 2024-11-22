import mockdate from 'mockdate'

import { OfferResponseV2 } from 'api/gen'
import { getNextMoviesByDate } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { dateBuilder, mockBuilder } from 'tests/mockBuilder'

const SELECTED_DATE = dateBuilder().withDay(5).toString()
const SELECTED_DATE_PLUS_1 = dateBuilder().withDay(6).toString()

const TODAY = dateBuilder().withDay(1).toString()
const TOMORROW = dateBuilder().withDay(2).toString()
const AFTER_TOMORROW = dateBuilder().withDay(3).toString()
const AFTER_15_DAYS = dateBuilder().withDay(17).toString()

const TOMORROW_STOCKS = [
  mockBuilder.offerStockResponse({ beginningDatetime: TOMORROW }),
  mockBuilder.offerStockResponse({ beginningDatetime: AFTER_TOMORROW }),
]
const AFTER_15_DAYS_STOCKS = [mockBuilder.offerStockResponse({ beginningDatetime: AFTER_15_DAYS })]

mockdate.set(TODAY)

describe('getNextMoviesByDate', () => {
  it('should return next movies', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({ id: 1, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ id: 2, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ id: 3, stocks: TOMORROW_STOCKS }),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(offerStocks.length)
  })

  it('should not return movies with only stocks after 15 days', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({ id: 1, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ id: 2, stocks: AFTER_15_DAYS_STOCKS }),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(1)
    expect(nextMovies[0]?.offer.id).toBe(1)
  })

  it('should return movies with stocks after 15 days only if they have also stocks in the next 15 days', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({ beginningDatetime: TOMORROW }),
          mockBuilder.offerStockResponse({ beginningDatetime: AFTER_15_DAYS }),
          mockBuilder.offerStockResponse({ beginningDatetime: AFTER_15_DAYS }),
        ],
      }),
    ]
    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(1)
  })

  it('should return the movies with their first upcoming date', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({ beginningDatetime: AFTER_TOMORROW }),
          mockBuilder.offerStockResponse({ beginningDatetime: TOMORROW }),
        ],
      }),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(TOMORROW))
  })

  it('should return the movies with their first upcoming date when the selected day is different than today', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({ beginningDatetime: TOMORROW }),
          mockBuilder.offerStockResponse({ beginningDatetime: AFTER_TOMORROW }),
          mockBuilder.offerStockResponse({ beginningDatetime: SELECTED_DATE_PLUS_1 }),
        ],
      }),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(SELECTED_DATE))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(SELECTED_DATE_PLUS_1))
  })

  it('should return the movies with the first upcoming stock if there is none after the selected date within the 15 next days from today', () => {
    const offerStocks: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({
        stocks: [
          mockBuilder.offerStockResponse({ beginningDatetime: TOMORROW }),
          mockBuilder.offerStockResponse({ beginningDatetime: AFTER_TOMORROW }),
        ],
      }),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(SELECTED_DATE))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(TOMORROW))
  })

  it('should return the movies with the no stock available from now', () => {
    const NOW = dateBuilder().withHours(16).toDate()
    mockdate.set(NOW)

    const BEFORE_NOW = dateBuilder().withHours(14).toString()
    const AFTER_NOW = dateBuilder().withHours(18).toString()

    const STOCK_BEFORE_NOW = mockBuilder.offerStockResponse({ beginningDatetime: BEFORE_NOW })
    const STOCK_AFTER_NOW = mockBuilder.offerStockResponse({ beginningDatetime: AFTER_NOW })

    const offersContainingAnOfferAfterNow = getNextMoviesByDate(
      [mockBuilder.offerResponseV2({ stocks: [STOCK_BEFORE_NOW, STOCK_AFTER_NOW] })],
      NOW
    )

    expect(offersContainingAnOfferAfterNow).toHaveLength(0)

    const offersContainingNoOfferAfterNow = getNextMoviesByDate(
      [mockBuilder.offerResponseV2({ stocks: [STOCK_BEFORE_NOW, ...TOMORROW_STOCKS] })],
      NOW
    )

    expect(offersContainingNoOfferAfterNow).toHaveLength(1)
  })

  it('should not return a movie if there is no stock after the selected date', () => {
    const NOW = dateBuilder().withHours(16).toDate()
    mockdate.set(NOW)

    const BEFORE_NOW = dateBuilder().withHours(14).toString()

    const STOCK_BEFORE_NOW = mockBuilder.offerStockResponse({ beginningDatetime: BEFORE_NOW })

    const offersContainingNoOfferAfterNow = getNextMoviesByDate(
      [mockBuilder.offerResponseV2({ stocks: [STOCK_BEFORE_NOW] })],
      NOW
    )

    expect(offersContainingNoOfferAfterNow).toHaveLength(0)
  })

  it('should sort the offers by descending last30DaysBookings order', () => {
    const offers: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({ last30DaysBookings: 100, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ last30DaysBookings: 300, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ last30DaysBookings: 200, stocks: TOMORROW_STOCKS }),
      mockBuilder.offerResponseV2({ last30DaysBookings: 400, stocks: TOMORROW_STOCKS }),
    ]

    const filteredOffersStocks = getNextMoviesByDate(offers, new Date(TODAY))

    expect(filteredOffersStocks[0]?.offer?.last30DaysBookings).toBe(400)
    expect(filteredOffersStocks[1]?.offer?.last30DaysBookings).toBe(300)
    expect(filteredOffersStocks[2]?.offer.last30DaysBookings).toBe(200)
    expect(filteredOffersStocks[3]?.offer.last30DaysBookings).toBe(100)
  })

  it('should sort the offers by ascending beginingDateTime order if 2 offers have the same last30DaysBooking value', () => {
    const EARLIER_BEGINNING_DATE_TIME = dateBuilder().withDay(2).withHours(1).toString()
    const LATER_BEGINNING_DATE_TIME = dateBuilder().withDay(2).withHours(2).toString()

    const EARLIER_STOCKS = [
      mockBuilder.offerStockResponse({ beginningDatetime: EARLIER_BEGINNING_DATE_TIME }),
    ]
    const LATER_STOCKS = [
      mockBuilder.offerStockResponse({ beginningDatetime: LATER_BEGINNING_DATE_TIME }),
    ]

    const offers: OfferResponseV2[] = [
      mockBuilder.offerResponseV2({ id: 1, last30DaysBookings: 300, stocks: LATER_STOCKS }),
      mockBuilder.offerResponseV2({ id: 2, last30DaysBookings: 300, stocks: EARLIER_STOCKS }),
    ]

    const filteredOffersStocks = getNextMoviesByDate(offers, new Date(TODAY))

    expect(filteredOffersStocks[0]?.offer?.id).toBe(2)
    expect(filteredOffersStocks[1]?.offer?.id).toBe(1)
  })
})
