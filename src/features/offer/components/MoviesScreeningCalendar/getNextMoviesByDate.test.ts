import mockdate from 'mockdate'

import { OfferResponseV2 } from 'api/gen'
import { getNextMoviesByDate } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import {
  dateBuilder,
  offerResponseBuilder,
  stockBuilder,
} from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'

const SELECTED_DATE = dateBuilder().withDay(5).toString()
const SELECTED_DATE_PLUS_1 = dateBuilder().withDay(6).toString()

const TODAY = dateBuilder().withDay(1).toString()
const TOMORROW = dateBuilder().withDay(2).toString()
const AFTER_TOMORROW = dateBuilder().withDay(3).toString()
const AFTER_15_DAYS = dateBuilder().withDay(17).toString()

const TOMORROW_STOCKS = [
  stockBuilder().withBeginningDatetime(TOMORROW).build(),
  stockBuilder().withBeginningDatetime(AFTER_TOMORROW).build(),
]
const AFTER_15_DAYS_STOCKS = [stockBuilder().withBeginningDatetime(AFTER_15_DAYS).build()]

mockdate.set(TODAY)

describe('getNextMoviesByDate', () => {
  it('should return next movies', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder().withId(1).withStocks(TOMORROW_STOCKS).build(),
      offerResponseBuilder().withId(2).withStocks(TOMORROW_STOCKS).build(),
      offerResponseBuilder().withId(3).withStocks(TOMORROW_STOCKS).build(),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(offerStocks.length)
  })

  it('should not return movies with only stocks after 15 days', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder().withId(1).withStocks(TOMORROW_STOCKS).build(),
      offerResponseBuilder().withId(2).withStocks(AFTER_15_DAYS_STOCKS).build(),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(1)
    expect(nextMovies[0]?.offer.id).toBe(1)
  })

  it('should return movies with stocks before and after 15 days', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(TOMORROW).build(),
          stockBuilder().withBeginningDatetime(AFTER_15_DAYS).build(),
          stockBuilder().withBeginningDatetime(AFTER_15_DAYS).build(),
        ])
        .build(),
    ]
    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies).toHaveLength(1)
  })

  it('should return the movies with their first upcoming date', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(AFTER_TOMORROW).build(),
          stockBuilder().withBeginningDatetime(TOMORROW).build(),
        ])
        .build(),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(TOMORROW))
  })

  it('should return the movies with their first upcoming date when the selected day is different than today', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(TOMORROW).build(),
          stockBuilder().withBeginningDatetime(AFTER_TOMORROW).build(),
          stockBuilder().withBeginningDatetime(SELECTED_DATE_PLUS_1).build(),
        ])
        .build(),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(SELECTED_DATE))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(SELECTED_DATE_PLUS_1))
  })

  it('should return the movies with the first upcoming stock if there is none after the selected date within the 15 next days from today', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder()
        .withStocks([
          stockBuilder().withBeginningDatetime(TOMORROW).build(),
          stockBuilder().withBeginningDatetime(AFTER_TOMORROW).build(),
        ])
        .build(),
    ]

    const nextMovies = getNextMoviesByDate(offerStocks, new Date(SELECTED_DATE))

    expect(nextMovies[0]?.nextDate).toStrictEqual(new Date(TOMORROW))
  })

  it('should return the movies with the no stock available from now', () => {
    const NOW = dateBuilder().withHours(16).toDate()
    mockdate.set(NOW)

    const BEFORE_NOW = dateBuilder().withHours(14).toString()
    const AFTER_NOW = dateBuilder().withHours(18).toString()

    const STOCK_BEFORE_NOW = stockBuilder().withBeginningDatetime(BEFORE_NOW).build()
    const STOCK_AFTER_NOW = stockBuilder().withBeginningDatetime(AFTER_NOW).build()

    const offersContainingAnOfferAfterNow = getNextMoviesByDate(
      [offerResponseBuilder().withStocks([STOCK_BEFORE_NOW, STOCK_AFTER_NOW]).build()],
      NOW
    )

    expect(offersContainingAnOfferAfterNow).toHaveLength(0)

    const offersContainingNoOfferAfterNow = getNextMoviesByDate(
      [
        offerResponseBuilder()
          .withStocks([STOCK_BEFORE_NOW, ...TOMORROW_STOCKS])
          .build(),
      ],
      NOW
    )

    expect(offersContainingNoOfferAfterNow).toHaveLength(1)
  })

  it('should not return a movie if there is no stock after the selected date', () => {
    const NOW = dateBuilder().withHours(16).toDate()
    mockdate.set(NOW)

    const BEFORE_NOW = dateBuilder().withHours(14).toString()

    const STOCK_BEFORE_NOW = stockBuilder().withBeginningDatetime(BEFORE_NOW).build()

    const offersContainingNoOfferAfterNow = getNextMoviesByDate(
      [offerResponseBuilder().withStocks([STOCK_BEFORE_NOW]).build()],
      NOW
    )

    expect(offersContainingNoOfferAfterNow).toHaveLength(0)
  })

  it('should return the movies with upcoming to true if the next movie is the first', () => {
    const offerStocks: OfferResponseV2[] = [
      offerResponseBuilder()
        .withStocks([
          stockBuilder().withId(1).withBeginningDatetime(TOMORROW).build(),
          stockBuilder().withId(2).withBeginningDatetime(AFTER_TOMORROW).build(),
        ])
        .build(),
    ]

    let nextMovies = getNextMoviesByDate(offerStocks, new Date(TODAY))

    expect(nextMovies[0]?.isUpcoming).toBeTruthy()

    nextMovies = getNextMoviesByDate(offerStocks, new Date(SELECTED_DATE))

    expect(nextMovies[0]?.isUpcoming).toBeTruthy()

    nextMovies = getNextMoviesByDate(offerStocks, new Date(TOMORROW))

    expect(nextMovies[0]?.isUpcoming).toBeFalsy()
  })
})
