import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { render, screen, waitFor, within } from 'tests/utils'

jest.mock('libs/firebase/analytics')

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

jest.mock('features/auth/context/SettingsContext')

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)

jest.useFakeTimers({ legacyFakeTimers: true })

const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('SearchHeader component', () => {
  it('should render SearchHeader', async () => {
    renderSearchHeader(true, false)

    await screen.findByText('Rechercher')

    expect(screen).toMatchSnapshot()
  })

  it('should show LocationWidget when ENABLE_APP_LOCATION featureFlag is on and when isDesktopViewport is false and SearchView is Landing', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchHeader(true, false)

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText('Me localiser')).toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when ENABLE_APP_LOCATION featureFlag is off and when isDesktopViewport is false and SearchView is Landing', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderSearchHeader(true, false)

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText('Me localiser')).not.toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when ENABLE_APP_LOCATION featureFlag is on and when isDesktopViewport is false and searchView is not landing', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchHeader(false, false)

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText('Me localiser')).not.toBeOnTheScreen()
    })
  })

  it('should show SearchLocationWidget when ENABLE_APP_LOCATION featureFlag is on and when isDesktopViewport is false', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchHeader(true, false)

    await waitFor(() => {
      const searchHeaderTitleContainer = within(screen.getByTestId('SearchHeaderTitleContainer'))

      expect(searchHeaderTitleContainer.queryByText('Me localiser')).not.toBeOnTheScreen()
    })
  })

  it('should not show LocationWidget when ENABLE_APP_LOCATION featureFlag is on and when isDesktopViewport is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchHeader(true, true)

    await waitFor(() => {
      const insideLocationWidget = within(screen.getByTestId('InsideLocationWidget'))

      expect(insideLocationWidget.queryByText('Me localiser')).not.toBeOnTheScreen()
    })
  })

  it('should show SearchLocationWidget when ENABLE_APP_LOCATION featureFlag is on and when isDesktopViewport is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(true)
    renderSearchHeader(true, true)

    await waitFor(() => {
      const searchHeaderTitleContainer = within(screen.getByTestId('SearchHeaderTitleContainer'))

      expect(searchHeaderTitleContainer.queryByText('Me localiser')).toBeOnTheScreen()
    })
  })

  it('should not show SearchLocationWidget when ENABLE_APP_LOCATION featureFlag is off and when isDesktopViewport is true', async () => {
    useFeatureFlagSpy.mockReturnValueOnce(false)
    renderSearchHeader(true, true)

    await waitFor(() => {
      const searchHeaderTitleContainer = within(screen.getByTestId('SearchHeaderTitleContainer'))

      expect(searchHeaderTitleContainer.queryByText('Me localiser')).not.toBeOnTheScreen()
    })
  })
})

function renderSearchHeader(shouldDisplaySubtitle: boolean, isDesktopViewport?: boolean) {
  const searchInputID = uuidv4()

  return render(
    <SearchHeader
      searchInputID={searchInputID}
      shouldDisplaySubtitle={shouldDisplaySubtitle}
      addSearchHistory={jest.fn()}
      searchInHistory={jest.fn()}
    />,
    {
      theme: { isDesktopViewport: isDesktopViewport ?? false },
    }
  )
}
