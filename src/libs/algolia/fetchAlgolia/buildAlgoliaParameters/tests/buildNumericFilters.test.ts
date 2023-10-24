import mockdate from 'mockdate'

import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { buildNumericFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildNumericFilters'

const defaultBuildNumericFilters = {
  date: null,
  beginningDatetime: undefined,
  endingDatetime: undefined,
  offerIsFree: false,
  offerIsNew: false,
  priceRange: null,
  timeRange: null,
  minPrice: '',
  maxPrice: '',
  maxPossiblePrice: '',
  minBookingsThreshold: 0,
}

describe('buildNumericFilters', () => {
  beforeAll(() => {
    mockdate.set(new Date('2023-04-24'))
  })

  it('should return default offer prices as a filter when no numeric filters defined', () => {
    const numericFilters = buildNumericFilters(defaultBuildNumericFilters)

    expect(numericFilters).toEqual({ numericFilters: [['offer.prices: 0 TO 300']] })
  })

  it('should return a price range as a filter when prices defined', () => {
    const numericFilters = buildNumericFilters({
      ...defaultBuildNumericFilters,
      minPrice: '10',
      maxPrice: '50',
    })

    expect(numericFilters).toEqual({ numericFilters: [['offer.prices: 10 TO 50']] })
  })

  it('should return a date and default offer prices as filter when date defined', () => {
    const numericFilters = buildNumericFilters({
      ...defaultBuildNumericFilters,
      date: {
        option: DATE_FILTER_OPTIONS.TODAY,
        selectedDate: new Date('2023-04-24').toISOString(),
      },
    })

    expect(numericFilters).toEqual({
      numericFilters: [['offer.prices: 0 TO 300'], ['offer.dates: 1682294400 TO 1682380799']],
    })
  })

  it('should return the offers of the last 15 days and default offer prices as filter when offerIsNew is true', () => {
    const numericFilters = buildNumericFilters({
      ...defaultBuildNumericFilters,
      offerIsNew: true,
    })

    expect(numericFilters).toEqual({
      numericFilters: [
        ['offer.prices: 0 TO 300'],
        ['offer.stocksDateCreated: 1680998400 TO 1682294400'],
      ],
    })
  })

  it('should return the homepage date and default offer prices as filter when beginning and ending date defined', () => {
    const numericFilters = buildNumericFilters({
      ...defaultBuildNumericFilters,
      beginningDatetime: new Date('2023-04-20').toISOString(),
      endingDatetime: new Date('2023-04-24').toISOString(),
    })

    expect(numericFilters).toEqual({
      numericFilters: [['offer.prices: 0 TO 300'], ['offer.dates: 1681948800 TO 1682294400']],
    })
  })

  it('should return the minimum booking threshold and default offer prices as filter when minimum booking threshold defined', () => {
    const numericFilters = buildNumericFilters({
      ...defaultBuildNumericFilters,
      minBookingsThreshold: 1,
    })

    expect(numericFilters).toEqual({
      numericFilters: [['offer.prices: 0 TO 300'], ['offer.last30DaysBookings >= 1']],
    })
  })
})
