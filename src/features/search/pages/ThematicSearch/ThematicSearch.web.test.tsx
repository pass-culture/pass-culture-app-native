import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { contentfulGtlPlaylistSnap } from 'features/gtlPlaylist/fixtures/contentfulGtlPlaylistSnap'
import { initialSearchState } from 'features/search/context/reducer'
import * as useSearch from 'features/search/context/SearchWrapper'
import { ThematicSearch } from 'features/search/pages/ThematicSearch/ThematicSearch'
import { env } from 'libs/environment/env'
import { LocationMode } from 'libs/location/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

const mockDispatch = jest.fn()

jest.spyOn(useSearch, 'useSearch').mockReturnValue({
  searchState: initialSearchState,
  dispatch: mockDispatch,
  resetSearch: jest.fn(),
  isFocusOnSuggestions: false,
  showSuggestions: jest.fn(),
  hideSuggestions: jest.fn(),
})
const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

const defaultUseSearchResults = {
  data: { pages: [{ nbHits: 0, hits: [], page: 0 }] },
  hits: {},
  nbHits: 0,
  isFetching: false,
  isLoading: false,
  hasNextPage: true,
  fetchNextPage: jest.fn(),
  isFetchingNextPage: false,
}
const mockUseSearchResults = jest.fn(() => defaultUseSearchResults)
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => mockUseSearchResults(),
}))

const defaultUseLocation = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  onModalHideRef: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

describe('<ThematicSearch/>', () => {
  beforeEach(() => {
    mockServer.universalGet(
      `https://firebase.googleapis.com/v1alpha/projects/-/apps/${env.FIREBASE_APPID}/webConfig`,
      {}
    )
    mockServer.universalGet(
      'https://cdn.contentful.com/spaces/contentfulSpaceId/environments/environment/entries',
      contentfulGtlPlaylistSnap
    )
    mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
    MockOfferCategoriesParams({ offerCategories: [SearchGroupNameEnumv2.MUSIQUE] })
    mockUseSearchResults.mockReturnValue(defaultUseSearchResults)
    mockUseLocation.mockReturnValue(defaultUseLocation)
  })

  it('should render', async () => {
    await act(async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))
    })
    await screen.findByText('Musique')

    expect(screen).toMatchSnapshot()
  })

  it('should dispatch action with offerCategories when params change', async () => {
    await act(async () => {
      render(reactQueryProviderHOC(<ThematicSearch />))
    })
    await screen.findByText('Musique')

    await act(async () => {})

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_STATE',
      payload: expect.objectContaining({
        offerCategories: [SearchGroupNameEnumv2.MUSIQUE],
      }),
    })
  })

  it('should not have basic accessibility issues', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })

    const { container } = await renderThematicSearch()

    await screen.findByText('Musique')

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })

  it('should not have basic accessibility issues when offline', async () => {
    mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

    const { container } = await renderThematicSearch()

    await screen.findByText('Musique')

    const results = await checkAccessibilityFor(container)

    expect(results).toHaveNoViolations()
  })
})

const renderThematicSearch = async () =>
  act(async () => {
    return render(reactQueryProviderHOC(<ThematicSearch />))
  })

const MockOfferCategoriesParams = (offerCategoriesParams: {
  offerCategories: SearchGroupNameEnumv2[]
}) => {
  useRoute.mockImplementation(() => ({
    params: offerCategoriesParams,
    name: 'ThematicSearch',
  }))
}
