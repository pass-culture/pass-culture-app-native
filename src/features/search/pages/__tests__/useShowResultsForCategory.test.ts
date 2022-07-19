import { Platform } from 'react-native'

import { push as mockPush, navigate as mockNavigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { renderHook } from 'tests/utils'

import { useShowResultsForCategory } from '../useShowResultsForCategory'

const navigate = Platform.OS === 'web' ? mockPush : mockNavigate
const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
let mockStagedSearchState = initialSearchState
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
  useStagedSearch: () => ({
    searchState: mockStagedSearchState,
    dispatch: mockStagedDispatch,
  }),
}))

describe('useShowResultsForCategory', () => {
  beforeEach(() => {
    mockStagedSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
      priceRange: [0, 300],
      query: 'Big flo et Oli',
      offerCategories: [SearchGroupNameEnum.SPECTACLE], // initialize mock data with expected categories because dispatch is also a mock and won't change the mocked state
    }
  })

  it('should set category in staged search', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'SET_CATEGORY',
      payload: [SearchGroupNameEnum.SPECTACLE],
    })
  })

  it('should set search state with staged search state and categories', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(navigate).toBeCalledWith('TabNavigator', {
      params: {
        beginningDatetime: null,
        date: null,
        endingDatetime: null,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: ['SPECTACLE'],
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
      },
      screen: 'Search',
    })
  })
})
