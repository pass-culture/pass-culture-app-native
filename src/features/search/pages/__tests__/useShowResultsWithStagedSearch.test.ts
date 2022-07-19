import { Platform } from 'react-native'

import { navigate as mockNavigate, push as mockPush } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { renderHook } from 'tests/utils'

import { usePushWithStagedSearch } from '../usePushWithStagedSearch'

const push = Platform.OS === 'web' ? mockPush : mockNavigate
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

describe('useShowResultsWithStagedSearch', () => {
  beforeEach(() => {
    mockStagedSearchState = {
      ...initialSearchState,
      locationFilter: { locationType: LocationType.EVERYWHERE },
      priceRange: [0, 300],
      query: 'Big flo et Oli',
      offerCategories: [SearchGroupNameEnum.SPECTACLE],
    }
  })

  it('should navigate to search with staged search state', () => {
    const { result: resultCallback } = renderHook(usePushWithStagedSearch)

    resultCallback.current()

    expect(push).toHaveBeenCalledWith('TabNavigator', {
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
        view: SearchView.Landing,
        tags: [],
        timeRange: null,
      },
      screen: 'Search',
    })
  })
})
