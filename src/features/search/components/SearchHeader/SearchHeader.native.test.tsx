import { useRoute } from '@react-navigation/native'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { setSettings } from 'features/auth/tests/setSettings'
import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchView } from 'features/search/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { DEFAULT_REMOTE_CONFIG } from 'libs/firebase/remoteConfig/remoteConfig.constants'
import { LocationLabel } from 'libs/location/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, waitFor, within } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockData = { pages: [{ nbHits: 0, hits: [], page: 0 }] }
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockUseRoute = useRoute as jest.Mock

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
    renderSearchHeader({
      shouldDisplaySubtitle: true,
      isDesktopViewport: false,
      isMobileViewport: true,
    })

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.getByText(LocationLabel.everywhereLabel)).toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when isDesktopViewport is false and searchView is not landing', async () => {
    renderSearchHeader({
      shouldDisplaySubtitle: false,
      isDesktopViewport: false,
      isMobileViewport: true,
    })

    await waitFor(() => {
      expect(screen.queryByTestId('InsideLocationWidget')).not.toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when isDesktopViewport is true', async () => {
    renderSearchHeader({
      shouldDisplaySubtitle: true,
      isDesktopViewport: true,
      isMobileViewport: false,
    })

    await waitFor(() => {
      expect(screen.queryByTestId('InsideLocationWidget')).not.toBeOnTheScreen()
    })
  })

  describe('LocationWidgetBadge', () => {
    beforeEach(() => {
      jest.spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery').mockReturnValueOnce({
        ...remoteConfigResponseFixture,
        data: { ...DEFAULT_REMOTE_CONFIG },
      })
      mockUseRoute.mockReturnValueOnce({ name: SearchView.Results })
    })

    it('should show LocationWidgetBadge when isMobileViewport is true and searchView is Results or Thematic', async () => {
      renderSearchHeader({
        shouldDisplaySubtitle: false,
        isMobileViewport: true,
        isDesktopViewport: false,
      })

      await waitFor(() => {
        const insideLocationSearchWidget = within(screen.getByTestId('LocationWidgetBadge'))

        expect(
          insideLocationSearchWidget.getByText(LocationLabel.everywhereLabel)
        ).toBeOnTheScreen()
      })
    })

    it('should not show LocationWidgetBadge when isMobileViewport is false and searchView is Results or Thematic', async () => {
      renderSearchHeader({
        shouldDisplaySubtitle: false,
        isMobileViewport: false,
        isDesktopViewport: true,
      })

      await waitFor(() => {
        expect(screen.queryByTestId('LocationWidgetBadge')).not.toBeOnTheScreen()
      })
    })
  })
})

interface RenderSearchHeaderProps {
  shouldDisplaySubtitle: boolean
  isDesktopViewport?: boolean
  isMobileViewport?: boolean
}

function renderSearchHeader({
  shouldDisplaySubtitle,
  isDesktopViewport,
  isMobileViewport,
}: RenderSearchHeaderProps) {
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
      theme: {
        isDesktopViewport: isDesktopViewport ?? false,
        isMobileViewport: isMobileViewport ?? false,
      },
    }
  )
}
