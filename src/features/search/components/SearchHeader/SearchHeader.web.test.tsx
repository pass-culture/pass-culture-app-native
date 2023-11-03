import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { navigate, useRoute } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchView } from 'features/search/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, render, screen, waitFor, within } from 'tests/utils/web'

import { SearchHeader } from './SearchHeader'

jest.mock('react-query')

jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

const searchInputID = uuidv4()

describe('SearchHeader component', () => {
  it.each([[SearchView.Landing], [SearchView.Results]])(
    'should contain a button to go to the search suggestions view',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } })
      render(
        <SearchHeader
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )
      await act(async () => {})

      expect(await screen.findByText('Recherche par mots-clés')).toBeInTheDocument()
    }
  )

  it('should navigate to the search suggestion view when focusing then activating the button', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )

    await act(async () => {
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
    })

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
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    await act(async () => {})

    await waitFor(() => {
      expect(screen.queryByText('Recherche par mots-clés')).not.toBeInTheDocument()
    })
  })

  it.each([[SearchView.Landing], [SearchView.Results]])(
    'should not have focus on search main input',
    async (view) => {
      useRoute.mockReturnValueOnce({ params: { view } })
      render(
        <SearchHeader
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
        />
      )

      await act(async () => {
        await userEvent.tab()
        await userEvent.tab()
      })

      const searchMainInput = screen.getByRole('searchbox', { hidden: true })

      expect(searchMainInput).not.toHaveFocus()
    }
  )

  it('should skip focus on search main input, the next focus should be on the location filter button', async () => {
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )

    await act(async () => {
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
    })

    const locationFilterButton = screen.getByTestId('Me localiser')

    expect(locationFilterButton).toHaveFocus()
  })

  it('should show Rechercher when no params is given', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })

    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )
    await act(async () => {})

    expect(screen.getByText('Rechercher')).toBeTruthy()
  })

  it('should show a pin icon when no params is given', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    useRoute.mockReturnValueOnce({ params: { view: SearchView.Landing } })

    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    )

    await act(async () => {})
    const title = within(screen.getByTestId('SearchHeaderTitleContainer'))

    expect(title.getByTestId('location pointer not filled')).toBeTruthy()
  })
})
