import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { act, render, screen, waitFor } from 'tests/utils/web'

import { SearchHeader } from './SearchHeader'

jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

const searchInputID = uuidv4()

const mockDispatch = jest.fn()
const mockShowSuggestions = jest.fn()
const mockIsFocusOnSuggestions = false

const initialMockUseSearch = {
  searchState: initialSearchState,
  dispatch: mockDispatch,
  showSuggestions: mockShowSuggestions,
  isFocusOnSuggestions: mockIsFocusOnSuggestions,
}
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearch)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('libs/firebase/analytics/analytics')

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

describe('SearchHeader component', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseSearch.mockReturnValue(initialMockUseSearch)
  })

  it('should contain a button to go to the search suggestions view', async () => {
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
        shouldDisplaySubtitle
      />
    )
    await act(async () => {})

    expect(await screen.findByText('Recherche par mots-clés')).toBeInTheDocument()
  })

  it('should focus on location widget button', async () => {
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
        shouldDisplaySubtitle
      />
    )

    await act(async () => {
      await userEvent.tab()
    })

    const locationFilterButton = screen.getByTestId(
      'France entière - Ouvrir la modale de localisation'
    )

    expect(locationFilterButton).toHaveFocus()
  })

  it('should focus on suggestion when focusing and pressing enter', async () => {
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
        shouldDisplaySubtitle
      />
    )

    await act(async () => {
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.keyboard('{Enter}')
    })

    //The function is called with event parameter that is not used in the function that is why we use expect.anything()
    expect(mockShowSuggestions).toHaveBeenNthCalledWith(1, expect.anything())
  })

  it('should reset search state on go back', async () => {
    render(
      <SearchHeader
        searchInputID={searchInputID}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
        withArrow
      />
    )
    userEvent.click(screen.getByTestId('Revenir en arrière'))

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_STATE', payload: initialSearchState })
    })
  })

  it('should not have focus on search main input', async () => {
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
  })

  describe('when being focus on suggestion', () => {
    beforeEach(() => {
      mockUseSearch.mockReturnValue({
        ...initialMockUseSearch,
        searchState: { ...initialSearchState, query: 'la fnac' },
        isFocusOnSuggestions: true,
      })
    })

    it('should not render a button to focus on suggestion', async () => {
      render(
        <SearchHeader
          searchInputID={searchInputID}
          addSearchHistory={jest.fn()}
          searchInHistory={jest.fn()}
          shouldDisplaySubtitle
        />
      )
      await act(async () => {})

      await waitFor(() => {
        expect(screen.queryByText('Recherche par mots-clés')).not.toBeInTheDocument()
      })
    })
  })
})
