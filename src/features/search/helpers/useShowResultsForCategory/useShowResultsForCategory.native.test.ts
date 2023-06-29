import { v4 as uuidv4 } from 'uuid'

import { navigate as mockNavigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

import { useShowResultsForCategory } from './useShowResultsForCategory'

let mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const searchId = uuidv4()

describe('useShowResultsForCategory', () => {
  beforeEach(() => {
    mockSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
      priceRange: [0, 300],
      query: 'Big flo et Oli',
      offerCategories: [SearchGroupNameEnumv2.SPECTACLES], // initialize mock data with expected categories because dispatch is also a mock and won't change the mocked state
    }
  })

  it('should set search state with staged search state and categories', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

    expect(mockNavigate).toBeCalledWith('TabNavigator', {
      params: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerSubcategories: [],
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
      },
      screen: 'Search',
    })
  })

  it('should navigate with isOnline param when category selected is only online platform', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

    expect(mockNavigate).toBeCalledWith('TabNavigator', {
      params: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        isOnline: true,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
        offerIsDuo: false,
        offerIsFree: false,
        offerIsNew: false,
        offerSubcategories: [],
        offerTypes: { isDigital: false, isEvent: false, isThing: false },
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
      },
      screen: 'Search',
    })
  })
})
