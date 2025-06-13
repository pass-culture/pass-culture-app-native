import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { setSettings } from 'features/auth/tests/setSettings'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationLabel } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor, within } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

jest.mock('react-instantsearch-core', () => ({
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [],
  }),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    isFocusOnSuggestions: false,
    dispatch: jest.fn(),
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)

jest.useFakeTimers()

jest.mock('libs/firebase/analytics/analytics')

describe('SearchHeader component', () => {
  beforeEach(() => {
    setSettings()
    setFeatureFlags()
  })

  it('should render SearchHeader', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: true, isDesktopViewport: false })

    expect(await screen.findByText('Rechercher')).toBeOnTheScreen()
  })

  it('should show LocationWidget when isDesktopViewport is false and SearchView is Landing', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: true, isDesktopViewport: false })

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.getByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when isDesktopViewport is false and searchView is not landing', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: false, isDesktopViewport: false })

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText(LocationLabel.everywhereLabel)).not.toBeOnTheScreen()
    })
  })

  it('should show SearchLocationWidget when isDesktopViewport is false', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: true, isDesktopViewport: false })

    await waitFor(() => {
      const searchHeaderTitleContainer = within(screen.getByTestId('SearchHeaderTitleContainer'))

      expect(
        searchHeaderTitleContainer.queryByText(LocationLabel.everywhereLabel)
      ).not.toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when isDesktopViewport is true', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: true, isDesktopViewport: true })

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText(LocationLabel.everywhereLabel)).not.toBeOnTheScreen()
    })
  })

  it('should show SearchLocationWidget when isDesktopViewport is true', async () => {
    renderSearchHeader({ shouldDisplaySubtitle: true, isDesktopViewport: true })

    await waitFor(() => {
      const searchHeaderTitleContainer = within(screen.getByTestId('SearchHeaderTitleContainer'))

      expect(searchHeaderTitleContainer.getByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
    })
  })
})

interface RenderSearchHeaderProps {
  shouldDisplaySubtitle: boolean
  isDesktopViewport?: boolean
}

function renderSearchHeader({ shouldDisplaySubtitle, isDesktopViewport }: RenderSearchHeaderProps) {
  const searchInputID = uuidv4()

  return render(
    reactQueryProviderHOC(
      <SearchHeader
        searchInputID={searchInputID}
        shouldDisplaySubtitle={shouldDisplaySubtitle}
        addSearchHistory={jest.fn()}
        searchInHistory={jest.fn()}
      />
    ),
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
