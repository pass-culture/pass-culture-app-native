import React from 'react'

import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchState } from 'features/search/types'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

const venue = mockedSuggestedVenue

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.FILMS_SERIES_CINEMA],
  venue,
  priceRange: [0, 20],
}

jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: jest.fn() }),
}))

jest.mock('features/auth/context/AuthContext')

jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: { pages: [{ nbHits: 0, hits: [], page: 0 }] },
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: true,
    fetchNextPage: jest.fn(),
    isFetchingNextPage: false,
  }),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

jest.mock('react-instantsearch-core', () => ({
  ...jest.requireActual('react-instantsearch-core'),
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        offer: { name: 'Test1', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
      {
        objectID: '2',
        offer: { name: 'Test2', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
    ],
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
jest.mock('algoliasearch')

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<SearchLanding />', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
    })

    it('should not have basic accessibility issues', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })

      const { container } = render(reactQueryProviderHOC(<SearchLanding />))

      await screen.findByText('Rechercher')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })

    it('should not have basic accessibility issues when offline', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })

      const { container } = render(reactQueryProviderHOC(<SearchLanding />))

      await screen.findByText('Rechercher')

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})
