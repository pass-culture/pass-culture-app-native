import { renderHook } from '@testing-library/react-hooks'

import { SearchGroupNameEnum } from 'api/gen'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'

import { useShowResultsWithStagedSearch } from '../useShowResultsWithStagedSearch'

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

  it('should set search state with staged search state', () => {
    const { result: resultCallback } = renderHook(useShowResultsWithStagedSearch)

    resultCallback.current()

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: mockStagedSearchState,
    })
  })

  it('should show results', () => {
    const { result: resultCallback } = renderHook(useShowResultsWithStagedSearch)

    resultCallback.current()

    expect(mockDispatch).toHaveBeenLastCalledWith({
      type: 'SHOW_RESULTS',
      payload: true,
    })
  })
})
