import { renderHook } from '@testing-library/react-hooks'

import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'

import { useShowResultsForCategory } from '../useShowResultsForCategory'

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

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: mockStagedSearchState,
    })
  })

  it('should show results', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SHOW_RESULTS',
      payload: true,
    })
  })

  it("should set category in search state after all because state isn't updated when dispatching multiple times", () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(mockDispatch).toHaveBeenLastCalledWith({
      type: 'SET_CATEGORY',
      payload: [SearchGroupNameEnum.SPECTACLE],
    })
  })
})
