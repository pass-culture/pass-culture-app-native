import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { act, render } from 'tests/utils/web'

jest.mock('react-query')

jest.mock('react-instantsearch-hooks', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it.each([[SearchView.Landing], [SearchView.Results]])(
    'should contain a button to go to the search suggestions view',
    (view) => {
      useRoute.mockReturnValueOnce({ params: { view } })
      const { queryByText } = render(<SearchHeader searchInputID={searchInputID} />)

      expect(queryByText('Recherche par mots-clés')).toBeTruthy()
    }
  )

  it('should navigate to the search suggestion view when focusing then activating the button', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    await act(async () => {
      render(<SearchHeader searchInputID={searchInputID} />)
    })

    await userEvent.tab()

    await userEvent.keyboard('{Enter}')

    const params = {
      ...initialSearchState,
      view: SearchView.Suggestions,
    }
    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Search',
      params,
    })
  })

  it('should not render a button to go to the search suggestion view when not on landing or result', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'la fnac' } })
    const { queryByText } = render(<SearchHeader searchInputID={searchInputID} />)

    expect(queryByText('Recherche par mots-clés')).toBeNull()
  })

  it.each([[SearchView.Landing], [SearchView.Results]])(
    'should not have focus on search main input',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } }).mockReturnValueOnce({ params: { view } })
      const { getByRole } = render(<SearchHeader searchInputID={searchInputID} />)

      await act(async () => {
        await userEvent.tab()
        await userEvent.tab()
      })

      const searchMainInput = getByRole('searchbox', { hidden: true })
      expect(searchMainInput).not.toHaveFocus()
    }
  )

  it('should skip focus on search main input, the next focus should be on the location filter button', async () => {
    useRoute
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { getByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    await act(async () => {
      await userEvent.tab()
      await userEvent.tab()
    })

    const locationFilterButton = getByTestId('locationButton')
    expect(locationFilterButton).toHaveFocus()
  })
})
