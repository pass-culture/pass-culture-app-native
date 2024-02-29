import { SearchGroupNameEnumv2 } from 'api/gen'
import { useAccessibilityFiltersContext } from 'features/accessibility/context/AccessibilityFiltersWrapper'
import { DisplayedDisabilitiesEnum } from 'features/accessibility/enums'
import { initialSearchState } from 'features/search/context/reducer'
import { DATE_FILTER_OPTIONS } from 'features/search/enums'
import {
  FILTER_TYPES,
  useAppliedFilters,
} from 'features/search/helpers/useAppliedFilters/useAppliedFilters'
import { SearchState } from 'features/search/types'

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

const TODAY = new Date().toISOString()

const mockDisabilities = {
  [DisplayedDisabilitiesEnum.AUDIO]: false,
  [DisplayedDisabilitiesEnum.MENTAL]: false,
  [DisplayedDisabilitiesEnum.MOTOR]: false,
  [DisplayedDisabilitiesEnum.VISUAL]: false,
}
const defaultValuesAccessibilityContext = {
  disabilities: {
    ...mockDisabilities,
  },
  setDisabilities: jest.fn(),
}

jest.mock('features/accessibility/context/AccessibilityFiltersWrapper')
const mockUseAccessibilityFiltersContext = useAccessibilityFiltersContext as jest.Mock

describe('useAppliedFilters', () => {
  beforeEach(() => {
    mockUseAccessibilityFiltersContext.mockReturnValue(defaultValuesAccessibilityContext)
  })

  it('should return an array with Localisation by default', () => {
    const filterTypes = useAppliedFilters(mockSearchState)

    expect(filterTypes).toEqual([FILTER_TYPES.LOCATION])
  })

  describe('should return an array', () => {
    it('with Localisation and Catégories when search state has category', () => {
      mockSearchState = {
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
      }
      const filterTypes = useAppliedFilters(mockSearchState)

      expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.CATEGORIES])
    })

    it.each`
      description            | searchState
      ${'min price'}         | ${{ minPrice: '10' }}
      ${'max price'}         | ${{ maxPrice: '10' }}
      ${'min and max price'} | ${{ minPrice: '10', maxPrice: '10' }}
    `(
      'with Localisation and Prix when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters(mockSearchState)

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.PRICES])
      }
    )

    it.each`
      description                      | searchState
      ${'category and min price'}      | ${{ offerCategories: [SearchGroupNameEnumv2.SPECTACLES], minPrice: '10' }}
      ${'category and max price'}      | ${{ offerCategories: [SearchGroupNameEnumv2.SPECTACLES], maxPrice: '10' }}
      ${'category, min and max price'} | ${{ offerCategories: [SearchGroupNameEnumv2.SPECTACLES], minPrice: '10', maxPrice: '10' }}
    `(
      'with Localisation, Catégories and Prix when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters(mockSearchState)

        expect(filterTypes).toEqual([
          FILTER_TYPES.LOCATION,
          FILTER_TYPES.CATEGORIES,
          FILTER_TYPES.PRICES,
        ])
      }
    )

    it.each`
      description         | searchState
      ${'only duo offer'} | ${{ offerIsDuo: true }}
    `(
      'with Localisation and Type when search state has $description',
      ({ searchState }: { searchState: Partial<SearchState> }) => {
        mockSearchState = { ...initialSearchState, ...searchState }
        const filterTypes = useAppliedFilters(mockSearchState)

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.OFFER_DUO])
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
        const filterTypes = useAppliedFilters(mockSearchState)

        expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.DATES_HOURS])
      }
    )

    it('with Localisation, Catégories, Prix, Type and Dates & heures when search state has location, category, price, offer type and date', () => {
      mockSearchState = {
        ...initialSearchState,
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
        minPrice: '10',
        maxPrice: '10',
        offerIsDuo: true,
        date: { option: DATE_FILTER_OPTIONS.TODAY, selectedDate: TODAY },
      }
      const filterTypes = useAppliedFilters(mockSearchState)

      expect(filterTypes).toEqual([
        FILTER_TYPES.LOCATION,
        FILTER_TYPES.CATEGORIES,
        FILTER_TYPES.PRICES,
        FILTER_TYPES.OFFER_DUO,
        FILTER_TYPES.DATES_HOURS,
      ])
    })

    it('with Localisation and Accessibility when at least one accessibility property is selected', () => {
      mockUseAccessibilityFiltersContext.mockReturnValueOnce({
        disabilities: {
          [DisplayedDisabilitiesEnum.AUDIO]: true,
          [DisplayedDisabilitiesEnum.MENTAL]: false,
          [DisplayedDisabilitiesEnum.MOTOR]: false,
          [DisplayedDisabilitiesEnum.VISUAL]: false,
        },
        setDisabilities: jest.fn(),
      })

      mockSearchState = {
        ...initialSearchState,
      }

      const filterTypes = useAppliedFilters(mockSearchState)

      expect(filterTypes).toEqual([FILTER_TYPES.LOCATION, FILTER_TYPES.ACCESSIBILITY])
    })

    it('with Localisation but without Accessibility when no accessibility property is selected', () => {
      mockUseAccessibilityFiltersContext.mockReturnValueOnce({
        disabilities: {
          [DisplayedDisabilitiesEnum.AUDIO]: false,
          [DisplayedDisabilitiesEnum.MENTAL]: false,
          [DisplayedDisabilitiesEnum.MOTOR]: false,
          [DisplayedDisabilitiesEnum.VISUAL]: false,
        },
        setDisabilities: jest.fn(),
      })

      mockSearchState = {
        ...initialSearchState,
      }

      const filterTypes = useAppliedFilters(mockSearchState)

      expect(filterTypes).toEqual([FILTER_TYPES.LOCATION])
    })
  })
})
