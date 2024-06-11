import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { DEFAULT_TIME_RANGE, MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { renderHook } from 'tests/utils'

import { useFilterCount } from './useFilterCount'

const date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: new Date() }
const timeRange = DEFAULT_TIME_RANGE
const venueId = 5959
const Kourou = { label: 'Kourou', info: 'Guyane', geolocation: { latitude: 2, longitude: 3 } }

const fourFilters = {
  minPrice: '1', // 1 for minPrice & maxPrice
  maxPrice: String(MAX_PRICE), // 1 for minPrice & maxPrice
  offerCategories: ['FILMS_SERIES_CINEMA'], // 1
  timeRange, // 1
  venue: { ...Kourou, venueId }, // 1
}

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice')
const mockedUseMaxPrice = jest.mocked(useMaxPrice)
mockedUseMaxPrice.mockImplementation(() => MAX_PRICE)

jest.mock('libs/firebase/analytics/analytics')

describe('useFilterCount', () => {
  it.each`
    section                                | partialSearchState                                                    | expected
    ${'initial state'}                     | ${{}}                                                                 | ${0}
    ${'offerIsDuo'}                        | ${{ offerIsDuo: true }}                                               | ${1}
    ${'date'}                              | ${{ date }}                                                           | ${1}
    ${'timeRange'}                         | ${{ timeRange }}                                                      | ${1}
    ${'offerCategories - 0'}               | ${{ offerCategories: [] }}                                            | ${0}
    ${'offerCategories - 1'}               | ${{ offerCategories: ['CINEMA'] }}                                    | ${1}
    ${'minPrice'}                          | ${{ minPrice: '1' }}                                                  | ${1}
    ${'maxPrice'}                          | ${{ maxPrice: String(MAX_PRICE) }}                                    | ${1}
    ${'minPrice - maxPrice'}               | ${{ minPrice: '1', maxPrice: String(MAX_PRICE), offerIsFree: false }} | ${1}
    ${'offerIsFree - minPrice - maxPrice'} | ${{ offerIsFree: true, minPrice: '0', maxPrice: '0' }}                | ${1}
    ${'venue'}                             | ${{ venue: { ...Kourou, venueId } }}                                  | ${1}
    ${'fourFilters'}                       | ${fourFilters}                                                        | ${4}
  `(
    'should return the correct number of activated filters | $section',
    ({ partialSearchState, expected }) => {
      const state: SearchState = { ...initialSearchState, ...partialSearchState }

      expect(renderHook(() => useFilterCount(state)).result.current).toEqual(expected)
    }
  )
})
