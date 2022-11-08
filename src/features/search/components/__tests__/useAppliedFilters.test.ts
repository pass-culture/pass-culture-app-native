import { SearchGroupNameEnumv2 } from 'api/gen'
import { FILTER_TYPES, useAppliedFilters } from 'features/search/components/useAppliedFilters'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'

let mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))
const TODAY = new Date().toISOString()

describe('useAppliedFilters', () => {
  it('should return an array with Localisation by default', () => {
    const filterTypes = useAppliedFilters()

    expect(filterTypes).toEqual([FILTER_TYPES.LOCATION])
  })

  describe('should return an array ', () => {
    it('with Localisation and Catégories when search state has category', () => {
      mockSearchState = {
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
      }
      const filterTypes = useAppliedFilters()

      expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.CATEGORIES])
    })

    it.each`
      description            | searchState
      ${'min price'}         | ${{ minPrice: '10' }}
      ${'max price'}         | ${{ maxPrice: '10' }}
      ${'min and max price'} | ${{ minPrice: '10', maxPrice: '10' }}
    `(
      'with Localisation et Prix when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters()

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.PRICES])
      }
    )

    it.each`
      description         | searchState
      ${'only duo offer'} | ${{ offerIsDuo: true }}
      ${'digital offer'}  | ${{ offerTypes: { isDigital: true, isEvent: false, isThing: false } }}
      ${'event offer'}    | ${{ offerTypes: { isDigital: false, isEvent: true, isThing: false } }}
      ${'thing offer'}    | ${{ offerTypes: { isDigital: false, isEvent: false, isThing: true } }}
    `(
      'with Localisation et Type when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters()

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.OFFER_TYPE])
      }
    )

    it.each`
      description     | searchState
      ${'date'}       | ${{ date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY } }}
      ${'time range'} | ${{ timeRange: [8, 23] }}
    `(
      'with Localisation and Dates & heures when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters()

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.DATES_HOURS])
      }
    )
  })
})
