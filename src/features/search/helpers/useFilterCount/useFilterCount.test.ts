import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { DEFAULT_TIME_RANGE, MAX_PRICE } from 'features/search/helpers/reducer.helpers'
import { useMaxPrice } from 'features/search/helpers/useMaxPrice/useMaxPrice'
import { SearchState } from 'features/search/types'
import { GeoCoordinates } from 'libs/geolocation'
import { renderHook } from 'tests/utils'

import { useFilterCount } from './useFilterCount'

const date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: new Date() }
const timeRange = DEFAULT_TIME_RANGE
const venueId = 5959
const Kourou = { label: 'Kourou', info: 'Guyane', geolocation: { latitude: 2, longitude: 3 } }

const fourFilters = {
  locationFilter: { locationType: LocationType.EVERYWHERE }, // 1 with position shared
  minPrice: '1', // 1 for minPrice & maxPrice
  maxPrice: String(MAX_PRICE), // 1 for minPrice & maxPrice
  offerCategories: ['FILMS_SERIES_CINEMA'], // 1
  timeRange, // 1
} as SearchState

jest.mock('features/search/helpers/useMaxPrice/useMaxPrice')
const mockedUseMaxPrice = jest.mocked(useMaxPrice)

const DEFAULT_POSITION: GeoCoordinates = { latitude: 2, longitude: 40 }
let mockPosition: GeoCoordinates | null = DEFAULT_POSITION
jest.mock('libs/geolocation/GeolocationWrapper', () => ({
  useGeolocation: () => ({
    position: mockPosition,
  }),
}))

describe('useFilterCount', () => {
  beforeAll(() => {
    mockedUseMaxPrice.mockImplementation(() => MAX_PRICE)
  })

  afterEach(() => {
    mockPosition = DEFAULT_POSITION
  })

  it.each`
    section                                | partialSearchState                                                    | expected
    ${'initial state'}                     | ${{}}                                                                 | ${1}
    ${'offerIsDuo'}                        | ${{ offerIsDuo: true }}                                               | ${2}
    ${'date'}                              | ${{ date }}                                                           | ${2}
    ${'timeRange'}                         | ${{ timeRange }}                                                      | ${2}
    ${'offerCategories - 0'}               | ${{ offerCategories: [] }}                                            | ${1}
    ${'offerCategories - 1'}               | ${{ offerCategories: ['CINEMA'] }}                                    | ${2}
    ${'minPrice'}                          | ${{ minPrice: '1' }}                                                  | ${2}
    ${'maxPrice'}                          | ${{ maxPrice: String(MAX_PRICE) }}                                    | ${2}
    ${'minPrice - maxPrice'}               | ${{ minPrice: '1', maxPrice: String(MAX_PRICE), offerIsFree: false }} | ${2}
    ${'offerIsFree - minPrice - maxPrice'} | ${{ offerIsFree: true, minPrice: '0', maxPrice: '0' }}                | ${2}
    ${'fourFilters'}                       | ${fourFilters}                                                        | ${4}
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
    expect(renderHook(() => useFilterCount(everywhereSelected)).result.current).toEqual(1)

    const aroundMeSelected: SearchState = {
      ...initialSearchState,
      locationFilter: {
        locationType: LocationType.AROUND_ME,
        aroundRadius: 20,
      },
    }
    expect(renderHook(() => useFilterCount(aroundMeSelected)).result.current).toEqual(1)
  })

  it('should return the correct number of filter when user not share his position and location type is eveywhere', () => {
    mockPosition = null
    const everywhereSelected: SearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
    }
    expect(renderHook(() => useFilterCount(everywhereSelected)).result.current).toEqual(0)
  })
})
