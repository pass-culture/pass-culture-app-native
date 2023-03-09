import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import { act, render, screen, waitFor } from 'tests/utils/web'

import { SearchHeader } from './SearchHeader'

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
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } })
      render(<SearchHeader searchInputID={searchInputID} />)

      expect(await screen.findByText('Recherche par mots-clés')).toBeTruthy()
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

  it('should not render a button to go to the search suggestion view when not on landing or result', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Suggestions, query: 'la fnac' } })
    render(<SearchHeader searchInputID={searchInputID} />)

    await waitFor(() => {
      expect(screen.queryByText('Recherche par mots-clés')).toBeNull()
    })
  })

  it.each([[SearchView.Landing], [SearchView.Results]])(
    'should not have focus on search main input',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } }).mockReturnValueOnce({ params: { view } })
      render(<SearchHeader searchInputID={searchInputID} />)

      await act(async () => {
        await userEvent.tab()
        await userEvent.tab()
      })

      const searchMainInput = screen.getByRole('searchbox', { hidden: true })
      expect(searchMainInput).not.toHaveFocus()
    }
  )

  it('should skip focus on search main input, the next focus should be on the location filter button', async () => {
    useRoute
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
    render(<SearchHeader searchInputID={searchInputID} />)

    await act(async () => {
      await userEvent.tab()
      await userEvent.tab()
    })

    const locationFilterButton = screen.getByTestId('Me localiser')
    expect(locationFilterButton).toHaveFocus()
  })
})
