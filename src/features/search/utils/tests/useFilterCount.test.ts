import { mocked } from 'ts-jest/utils'

import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/context/reducer/reducer'
import { DEFAULT_TIME_RANGE, MAX_PRICE } from 'features/search/utils/reducer.helpers'
import { SearchState } from 'features/search/types'
import { useMaxPrice } from 'features/search/utils/useMaxPrice'
import { renderHook } from 'tests/utils'

import { useFilterCount } from '../useFilterCount'

const date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: new Date() }
const timeRange = DEFAULT_TIME_RANGE
const zeroOfferType = { isDigital: false, isEvent: false, isThing: false }
const oneOfferType = { isDigital: true, isEvent: false, isThing: false }
const twoOfferTypes = { isDigital: true, isEvent: true, isThing: false }
const threeOfferTypes = { isDigital: true, isEvent: true, isThing: true }
const venueId = 5959
const Kourou = { label: 'Kourou', info: 'Guyane', geolocation: { latitude: 2, longitude: 3 } }

const sevenFilters = {
  offerCategories: ['FILMS_SERIES_CINEMA', 'MEDIA_PRESSE'], // 2
  offerTypes: twoOfferTypes, // 2
  offerIsNew: true, // 1
  timeRange, // 1
  priceRange: [1, MAX_PRICE], // 1
} as SearchState

jest.mock('features/search/utils/useMaxPrice')
const mockedUseMaxPrice = mocked(useMaxPrice)

describe('useFilterCount', () => {
  beforeAll(() => {
    mockedUseMaxPrice.mockImplementation(() => MAX_PRICE)
  })

  it.each`
    section                          | partialSearchState                           | expected
    ${'initial state'}               | ${{}}                                        | ${0}
    ${'offerIsNew'}                  | ${{ offerIsNew: true }}                      | ${1}
    ${'offerIsDuo'}                  | ${{ offerIsDuo: true }}                      | ${1}
    ${'offerIsNew'}                  | ${{ offerIsNew: true }}                      | ${1}
    ${'offerIsNew + offerIsDuo'}     | ${{ offerIsNew: true, offerIsDuo: true }}    | ${2}
    ${'date'}                        | ${{ date }}                                  | ${1}
    ${'timeRange'}                   | ${{ timeRange }}                             | ${1}
    ${'offerCategories - 0'}         | ${{ offerCategories: [] }}                   | ${0}
    ${'offerCategories - 1'}         | ${{ offerCategories: ['CINEMA'] }}           | ${1}
    ${'offerCategories - 2'}         | ${{ offerCategories: ['CINEMA', 'PRESSE'] }} | ${2}
    ${'priceRange - default'}        | ${{ priceRange: [0, MAX_PRICE] }}            | ${0}
    ${'priceRange - [1, MAX_PRICE]'} | ${{ priceRange: [1, MAX_PRICE] }}            | ${1}
    ${'priceRange - [0, 30]'}        | ${{ priceRange: [1, 30] }}                   | ${1}
    ${'offerTypes - 0'}              | ${{ offerTypes: zeroOfferType }}             | ${0}
    ${'offerTypes - 1'}              | ${{ offerTypes: oneOfferType }}              | ${1}
    ${'offerTypes - 2'}              | ${{ offerTypes: twoOfferTypes }}             | ${2}
    ${'offerTypes - 3'}              | ${{ offerTypes: threeOfferTypes }}           | ${3}
    ${'sevenFilters'}                | ${sevenFilters}                              | ${7}
  `(
    'should return the correct number of activated filters | $section',
    ({ partialSearchState, expected }) => {
      const state: SearchState = { ...initialSearchState, ...partialSearchState }
      expect(renderHook(() => useFilterCount(state)).result.current).toEqual(expected)
    }
  )

  it('should return the correct number of filter for all location configurations', () => {
    const venueSelected: SearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.VENUE,
        venue: { ...Kourou, venueId },
      },
    }
    expect(renderHook(() => useFilterCount(venueSelected)).result.current).toEqual(1)

    const placeSelected: SearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.PLACE,
        place: Kourou,
        aroundRadius: 20,
      },
    }
    expect(renderHook(() => useFilterCount(placeSelected)).result.current).toEqual(1)

    const everywhereSelected: SearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
    }
    expect(renderHook(() => useFilterCount(everywhereSelected)).result.current).toEqual(0)

    const aroundMeSelected: SearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.AROUND_ME,
        aroundRadius: 20,
      },
    }
    expect(renderHook(() => useFilterCount(aroundMeSelected)).result.current).toEqual(1)
  })
})

describe('useFilterCount under 18', () => {
  const maxPriceUnder18 = 30
  beforeAll(() => {
    mockedUseMaxPrice.mockImplementation(() => maxPriceUnder18)
  })

  it('returns 0 when no filters even when the max price is not 300 (underage)', () => {
    const { result } = renderHook(() =>
      useFilterCount({ ...initialSearchState, priceRange: [0, maxPriceUnder18] })
    )
    expect(result.current).toEqual(0)
  })

  it('returns 1 when filter is below the max price for underage', () => {
    const { result } = renderHook(() =>
      useFilterCount({ ...initialSearchState, priceRange: [0, 29] })
    )
    expect(result.current).toEqual(1)
  })
})
