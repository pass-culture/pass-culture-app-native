import mockdate from 'mockdate'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import {
  buildDateAndTimePredicate,
  buildDateOnlyPredicate,
  buildDatePredicate,
  buildHomepageDatePredicate,
  buildNewestOffersPredicate,
  buildOfferLast30DaysBookings,
  buildOfferPriceRangePredicate,
  buildTimeOnlyPredicate,
  getDatePredicate,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/helpers/buildNumericFiltersHelpers/buildNumericFiltersHelpers'

describe('buildOfferLast30DaysBookings', () => {
  it('should return an undefined offer last 30 days bookings predicate when not defined', () => {
    const offerLast30DaysBookingsPredicate = buildOfferLast30DaysBookings(undefined)
    expect(offerLast30DaysBookingsPredicate).toEqual(undefined)
  })

  it('should return an undefined offer last 30 days bookings predicate when defined at 0', () => {
    const offerLast30DaysBookingsPredicate = buildOfferLast30DaysBookings(0)
    expect(offerLast30DaysBookingsPredicate).toEqual(undefined)
  })

  it('should return an offer last 30 days bookings predicate when defined at a value > 0', () => {
    const offerLast30DaysBookingsPredicate = buildOfferLast30DaysBookings(1)
    expect(offerLast30DaysBookingsPredicate).toEqual(['offer.last30DaysBookings >= 1'])
  })
})

describe('buildOfferPriceRangePredicate', () => {
  const defaultBuildOfferPriceRangePredicate = {
    offerIsFree: false,
    priceRange: null,
  }

  it('should return an offer price range predicate from 0 to 300 when price range, minimum and maximum prices not defined', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate(
      defaultBuildOfferPriceRangePredicate
    )
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 0 TO 300'])
  })

  it('should return an offer price range predicate at 0 when offerIsFree is true', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      offerIsFree: true,
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices = 0'])
  })

  it('should return an offer price range predicate with the minimum price when defined and the default maximum price', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      minPrice: '10',
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 10 TO 300'])
  })

  it('should return an offer price range predicate with the maximum price when defined and the default minimum price', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      maxPrice: '15',
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 0 TO 15'])
  })

  it('should return an offer price range predicate with the maximum possible price when defined and the default minimum price', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      maxPossiblePrice: '80',
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 0 TO 80'])
  })

  it('should return an offer price range predicate with the price range when defined', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      priceRange: [5, 30],
      minPrice: '10',
      maxPrice: '300',
      maxPossiblePrice: '80',
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 5 TO 30'])
  })

  it('should return an offer price range predicate with the minimum and maximum prices when defined and price range not defined', () => {
    const offerPriceRangePredicate = buildOfferPriceRangePredicate({
      ...defaultBuildOfferPriceRangePredicate,
      minPrice: '10',
      maxPrice: '200',
      maxPossiblePrice: '80',
    })
    expect(offerPriceRangePredicate).toEqual(['offer.prices: 10 TO 200'])
  })
})

describe('buildDatePredicate', () => {
  const defaultDatePredicate = { date: null, timeRange: null }

  it('should return an undefined date predicate when date and time range not defined', () => {
    const datePredicate = buildDatePredicate(defaultDatePredicate)
    expect(datePredicate).toEqual(undefined)
  })

  it('should return a date predicate with date and time range when defined', () => {
    const datePredicate = buildDatePredicate({
      date: {
        option: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
      timeRange: [8, 24],
    })
    expect(datePredicate).toEqual(['offer.dates: 1682323200 TO 1682380800'])
  })

  it('should return a date predicate with date only when date defined and time range not defined', () => {
    const datePredicate = buildDatePredicate({
      ...defaultDatePredicate,
      date: {
        option: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
    })
    expect(datePredicate).toEqual(['offer.dates: 1682294400 TO 1682380799'])
  })

  it('should return a date predicate with time range only when time range defined and date not defined', () => {
    const datePredicate = buildDatePredicate({
      ...defaultDatePredicate,
      timeRange: [8, 24],
    })
    expect(datePredicate).toEqual(['offer.times: 28800 TO 86400'])
  })
})

describe('buildHomepageDatePredicate', () => {
  const defaultBuildHomepageDatePredicate = {
    beginningDatetime: undefined,
    endingDatetime: undefined,
  }

  it('should return an undefined homepage date predicate when beginning and ending date not defined', () => {
    const homepageDatePredicate = buildHomepageDatePredicate(defaultBuildHomepageDatePredicate)
    expect(homepageDatePredicate).toEqual(undefined)
  })

  it('should return an homepage date predicate with only beginning date when beginning date defined and ending date not defined', () => {
    const homepageDatePredicate = buildHomepageDatePredicate({
      ...defaultBuildHomepageDatePredicate,
      beginningDatetime: new Date('2023-04-20').toISOString(),
    })
    expect(homepageDatePredicate).toEqual(['offer.dates >= 1681948800'])
  })

  it('should return an homepage date predicate with only ending date when ending date defined and beginning date not defined', () => {
    const homepageDatePredicate = buildHomepageDatePredicate({
      ...defaultBuildHomepageDatePredicate,
      endingDatetime: new Date('2023-04-24').toISOString(),
    })
    expect(homepageDatePredicate).toEqual(['offer.dates <= 1682294400'])
  })

  it('should return an homepage date predicate with a beginning and ending dates when beginning and ending dates defined', () => {
    const homepageDatePredicate = buildHomepageDatePredicate({
      beginningDatetime: new Date('2023-04-20').toISOString(),
      endingDatetime: new Date('2023-04-24').toISOString(),
    })
    expect(homepageDatePredicate).toEqual(['offer.dates: 1681948800 TO 1682294400'])
  })
})

describe('buildTimeOnlyPredicate', () => {
  it('should return a time range in seconds', () => {
    const timeOnlyPredicate = buildTimeOnlyPredicate([8, 24])
    expect(timeOnlyPredicate).toEqual(['offer.times: 28800 TO 86400'])
  })
})

describe('buildDateAndTimePredicate', () => {
  it('should return a date and time predicate of the selected date and time range when date filter option is today', () => {
    const dateAndTimePredicate = buildDateAndTimePredicate({
      date: {
        option: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
      timeRange: [8, 24],
    })
    expect(dateAndTimePredicate).toEqual(['offer.dates: 1682323200 TO 1682380800'])
  })

  it('should return a date and time predicate of the selected date and time range when date filter option is user pick', () => {
    const dateAndTimePredicate = buildDateAndTimePredicate({
      date: {
        option: DATE_FILTER_OPTIONS.USER_PICK,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
      timeRange: [8, 24],
    })
    expect(dateAndTimePredicate).toEqual(['offer.dates: 1682323200 TO 1682380800'])
  })

  it('should return a date and time predicate of the selected dates and time range when date filter option is current week', () => {
    const dateAndTimePredicate = buildDateAndTimePredicate({
      date: {
        option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
      timeRange: [8, 24],
    })
    expect(dateAndTimePredicate).toEqual([
      'offer.dates: 1682323200 TO 1682380800',
      'offer.dates: 1682409600 TO 1682467200',
      'offer.dates: 1682496000 TO 1682553600',
      'offer.dates: 1682582400 TO 1682640000',
      'offer.dates: 1682668800 TO 1682726400',
      'offer.dates: 1682755200 TO 1682812800',
      'offer.dates: 1682841600 TO 1682899200',
    ])
  })

  it('should return a date and time predicate of the selected dates and time range when date filter option is current week-end', () => {
    const dateAndTimePredicate = buildDateAndTimePredicate({
      date: {
        option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
      timeRange: [8, 24],
    })
    expect(dateAndTimePredicate).toEqual([
      'offer.dates: 1682755200 TO 1682812800',
      'offer.dates: 1682841600 TO 1682899200',
    ])
  })
})

describe('buildDateOnlyPredicate', () => {
  it('should return a date predicate of the selected date when date filter option is today', () => {
    const dateOnlyPredicate = buildDateOnlyPredicate({
      option: DATE_FILTER_OPTIONS.TODAY,
      selectedDate: new Date('2023-04-24').toISOString(),
    })
    expect(dateOnlyPredicate).toEqual(['offer.dates: 1682294400 TO 1682380799'])
  })

  it('should return a date predicate of the selected dates when date filter option is current week', () => {
    const dateOnlyPredicate = buildDateOnlyPredicate({
      option: DATE_FILTER_OPTIONS.CURRENT_WEEK,
      selectedDate: new Date('2023-04-24').toISOString(),
    })
    expect(dateOnlyPredicate).toEqual(['offer.dates: 1682294400 TO 1682899199'])
  })

  it('should return a date predicate of the selected dates when date filter option is current week-end', () => {
    const dateOnlyPredicate = buildDateOnlyPredicate({
      option: DATE_FILTER_OPTIONS.CURRENT_WEEK_END,
      selectedDate: new Date('2023-04-24').toISOString(),
    })
    expect(dateOnlyPredicate).toEqual(['offer.dates: 1682726400 TO 1682899199'])
  })

  it('should return a date predicate of the selected date when date filter option is user pick', () => {
    const dateOnlyPredicate = buildDateOnlyPredicate({
      option: DATE_FILTER_OPTIONS.TODAY,
      selectedDate: new Date('2023-04-24').toISOString(),
    })
    expect(dateOnlyPredicate).toEqual(['offer.dates: 1682294400 TO 1682380799'])
  })
})

describe('buildNewestOffersPredicate', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-04-24'))
  })

  it('should return undefined where offerIsNew is false', () => {
    const newestOffersPredicate = buildNewestOffersPredicate(false)
    expect(newestOffersPredicate).toEqual(undefined)
  })

  it('should return a newest offers predicate when offerIsNew is true', () => {
    const newestOffersPredicate = buildNewestOffersPredicate(true)
    expect(newestOffersPredicate).toEqual(['offer.stocksDateCreated: 1680998400 TO 1682294400'])
  })
})

describe('getDatePredicate', () => {
  it('should return a date predicate from a beginning and ending dates', () => {
    const datePredicate = getDatePredicate(1682294400, 1682899199)
    expect(datePredicate).toEqual('offer.dates: 1682294400 TO 1682899199')
  })
})
