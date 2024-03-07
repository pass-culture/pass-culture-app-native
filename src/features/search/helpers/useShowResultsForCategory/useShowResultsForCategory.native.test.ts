import { v4 as uuidv4 } from 'uuid'

import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import { LocationMode } from 'libs/location/types'
import { placeholderData as mockData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

import { useShowResultsForCategory } from './useShowResultsForCategory'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
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
      locationFilter: { locationType: LocationMode.EVERYWHERE },
      priceRange: [0, 300],
      query: 'Big flo et Oli',
      offerCategories: [SearchGroupNameEnumv2.SPECTACLES], // initialize mock data with expected categories because dispatch is also a mock and won't change the mocked state
    }
  })

  it('should set search state with staged search state and categories', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
        offerIsDuo: false,
        offerIsFree: false,
        offerSubcategories: [],
        isDigital: false,
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
        gtls: [],
      },
    })
  })

  it('should set search state with isFullyDigitalOffersCategory param when category selected is only online platform', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        isFullyDigitalOffersCategory: true,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
        offerIsDuo: false,
        offerIsFree: false,
        offerSubcategories: [],
        isDigital: false,
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
        gtls: [],
      },
    })
  })

  it('should dispatch state to avoid useless fetch the time that the url parameters are loaded', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        isFullyDigitalOffersCategory: true,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
        offerIsDuo: false,
        offerIsFree: false,
        offerSubcategories: [],
        isDigital: false,
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
        gtls: [],
      },
    })
  })

  it('should set search state without isFromHistory param when category selected and previous search was from history', () => {
    mockSearchState = {
      ...mockSearchState,
      isFromHistory: true,
    }
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      type: 'SET_STATE',
      payload: {
        beginningDatetime: undefined,
        date: null,
        endingDatetime: undefined,
        hitsPerPage: 20,
        locationFilter: { locationType: 'EVERYWHERE' },
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
        offerIsDuo: false,
        offerIsFree: false,
        offerSubcategories: [],
        isDigital: false,
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        view: SearchView.Results,
        tags: [],
        timeRange: null,
        searchId,
        gtls: [],
      },
    })
  })
})
