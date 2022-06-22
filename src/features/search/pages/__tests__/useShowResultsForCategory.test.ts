import { renderHook } from '@testing-library/react-hooks'

import { SearchGroupNameEnum } from 'api/gen'
import { initialSearchState } from 'features/search/pages/reducer'

import { useShowResultsForCategory } from '../useShowResultsForCategory'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
const mockStagedSearchState = initialSearchState
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
  it('should set category', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_CATEGORY',
      payload: [SearchGroupNameEnum.SPECTACLE],
    })
  })

  it('should set category in staged search', () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnum.SPECTACLE)

    expect(mockStagedDispatch).toHaveBeenCalledWith({
      type: 'SET_CATEGORY',
      payload: [SearchGroupNameEnum.SPECTACLE],
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
})
