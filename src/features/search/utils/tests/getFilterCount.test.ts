import { LocationType } from 'features/search/enums'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { DEFAULT_TIME_RANGE, MAX_PRICE } from 'features/search/pages/reducer.helpers'
import { SearchState } from 'features/search/types'

import { getFilterCount } from '../getFilterCount'

const date = { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: new Date() }
const timeRange = DEFAULT_TIME_RANGE
const zeroOfferType = { isDigital: false, isEvent: false, isThing: false }
const oneOfferType = { isDigital: true, isEvent: false, isThing: false }
const twoOfferTypes = { isDigital: true, isEvent: true, isThing: false }
const threeOfferTypes = { isDigital: true, isEvent: true, isThing: true }
const venueId = 5959

const eightFilters = {
  offerCategories: ['CINEMA', 'PRESSE'], // 2
  offerTypes: twoOfferTypes, // 2
  offerIsNew: true, // 1
  timeRange, // 1
  priceRange: [1, MAX_PRICE], // 1
  venueId, // 1
}

describe('getFilterCount', () => {
  it.each`
    section                          | partialSearchState                           | expected
    ${'initial state'}               | ${{}}                                        | ${0}
    ${'offerIsNew'}                  | ${{ offerIsNew: true }}                      | ${1}
    ${'offerIsDuo'}                  | ${{ offerIsDuo: true }}                      | ${1}
    ${'offerIsNew'}                  | ${{ offerIsNew: true }}                      | ${1}
    ${'offerIsNew + offerIsDuo'}     | ${{ offerIsNew: true, offerIsDuo: true }}    | ${2}
    ${'date'}                        | ${{ date }}                                  | ${1}
    ${'timeRange'}                   | ${{ timeRange }}                             | ${1}
    ${'locationType - everywhere'}   | ${{ locationType: LocationType.EVERYWHERE }} | ${0}
    ${'locationType - around me'}    | ${{ locationType: LocationType.AROUND_ME }}  | ${1}
    ${'locationType - place'}        | ${{ locationType: LocationType.PLACE }}      | ${1}
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
    ${'venueId'}                     | ${{ venueId }}                               | ${1}
    ${'eightFilters'}                | ${eightFilters}                              | ${8}
  `(
    'should return the correct number of activated filters | $section',
    ({ partialSearchState, expected }) => {
      const state: SearchState = { ...initialSearchState, ...partialSearchState }
      expect(getFilterCount(state)).toEqual(expected)
    }
  )

  it('should return the correct number of filter for all location configurations', () => {
    const venueSelected: SearchState = {
      ...initialSearchState,
      locationType: LocationType.PLACE,
      venueId,
    }
    expect(getFilterCount(venueSelected)).toEqual(1)

    const placeSelected: SearchState = {
      ...initialSearchState,
      locationType: LocationType.PLACE,
      place: { label: 'Kourou', info: 'Guyane', geolocation: { latitude: 2, longitude: 3 } },
    }
    expect(getFilterCount(placeSelected)).toEqual(1)

    const everywhereSelected: SearchState = {
      ...initialSearchState,
      locationType: LocationType.EVERYWHERE,
    }
    expect(getFilterCount(everywhereSelected)).toEqual(0)

    const aroundMeSelected: SearchState = {
      ...initialSearchState,
      locationType: LocationType.AROUND_ME,
    }
    expect(getFilterCount(aroundMeSelected)).toEqual(1)
  })
})
