import { v4 as uuidv4 } from 'uuid'

import { navigate as mockNavigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { analytics } from 'libs/firebase/analytics'
import { renderHook } from 'tests/utils'

import { useShowResultsForCategory } from '../useShowResultsForCategory'

let mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
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
        beginningDatetime: null,
        date: null,
        endingDatetime: null,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: ['SPECTACLES'],
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

  it('should log event', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

    expect(analytics.logUseLandingCategory).toHaveBeenCalledWith(
      SearchGroupNameEnumv2.SPECTACLES,
      searchId
    )
  })
})
