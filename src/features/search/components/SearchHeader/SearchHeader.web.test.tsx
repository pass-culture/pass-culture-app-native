import userEvent from '@testing-library/user-event'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { initialSearchState } from 'features/search/context/reducer'
import { SearchState } from 'features/search/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { act, render, screen, waitFor } from 'tests/utils/web'

import { SearchHeader } from './SearchHeader'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

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

let mockSearchState: SearchState = initialSearchState
const mockDispatch = jest.fn()
const mockShowSuggestions = jest.fn()
let mockIsFocusOnSuggestions = false
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
    showSuggestions: mockShowSuggestions,
    isFocusOnSuggestions: mockIsFocusOnSuggestions,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('features/navigation/TabBar/routes')

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('SearchHeader component', () => {
  afterEach(() => {
    mockSearchState = initialSearchState
    mockIsFocusOnSuggestions = false
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
      'Ouvrir la modale de localisation depuis le widget'
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

  it('should not render a button to focus on suggestion when being focus on suggestion', async () => {
    mockSearchState = { ...mockSearchState, query: 'la fnac' }
    mockIsFocusOnSuggestions = true
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
})
