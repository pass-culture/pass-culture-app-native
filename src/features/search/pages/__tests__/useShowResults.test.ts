import { renderHook } from '@testing-library/react-hooks'

import { initialSearchState } from 'features/search/pages/reducer'
import { useShowResults } from 'features/search/pages/useShowResults'
import { waitFor } from 'tests/utils'

const mockSearchState = initialSearchState

jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState }),
}))

jest.mock('features/search/pages/useSearchResults', () => ({
  useSearchResults: () => ({ isLoading: false }),
}))

describe('useShowResults hook', () => {
  it('should show results when search has results', async () => {
    mockSearchState.showResults = true
    const { result } = renderHook(useShowResults)

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it('should not show results when search has no results', async () => {
    mockSearchState.showResults = false
    const { result } = renderHook(useShowResults)

    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })
})
