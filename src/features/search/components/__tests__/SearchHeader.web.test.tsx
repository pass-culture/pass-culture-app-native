import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { push, useRoute } from '__mocks__/@react-navigation/native'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchView } from 'features/search/types'
import { render } from 'tests/utils/web'

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

  it('should contain a button to go to the search suggestions view', () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { queryByRole } = render(<SearchHeader searchInputID={searchInputID} />)

    const button = queryByRole('button')

    expect(button).toHaveTextContent('Recherche par mots-clés')
  })

  it('should navigate to the search suggestion view when focusing then activating the button', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    render(<SearchHeader searchInputID={searchInputID} />)

    await userEvent.tab()

    await userEvent.keyboard('{Enter}')

    const params = {
      ...initialSearchState,
      view: SearchView.Suggestions,
    }
    expect(push).toHaveBeenCalledWith('TabNavigator', {
      screen: 'Search',
      params,
    })
  })

  it.each([[SearchView.Suggestions], [SearchView.Results]])(
    'should not render a button to go to the search suggestion view when not on landing',
    (view) => {
      useRoute.mockReturnValueOnce({ params: { view, query: 'la fnac' } })
      const { queryByRole } = render(<SearchHeader searchInputID={searchInputID} />)

      const button = queryByRole('button')

      expect(button).toBeNull()
    }
  )

  it('search main input should not be focusable', async () => {
    useRoute
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { getByRole } = render(<SearchHeader searchInputID={searchInputID} />)

    await userEvent.tab()
    await userEvent.tab()

    const searchMainInput = getByRole('searchbox', { hidden: true })
    expect(searchMainInput).not.toHaveFocus()
  })

  it('skip focus on search main input, the next focus should be on the location filter button', async () => {
    useRoute
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
      .mockReturnValueOnce({ params: { view: SearchView.Landing } })
    const { getByTestId } = render(<SearchHeader searchInputID={searchInputID} />)

    await userEvent.tab()
    await userEvent.tab()

    const locationFilterButton = getByTestId('locationButton')
    expect(locationFilterButton).toHaveFocus()
  })
})
