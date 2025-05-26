import React from 'react'

import { SearchGroupNameEnumv2, SubcategoriesResponseModelv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchLanding } from 'features/search/pages/SearchLanding/SearchLanding'
import { SearchState } from 'features/search/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { checkAccessibilityFor, render, screen } from 'tests/utils/web'

jest.setTimeout(20000) // to avoid exceeded timeout

jest.mock('libs/network/NetInfoWrapper')

const venue = mockedSuggestedVenue

const mockSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnumv2.CINEMA],
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

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

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

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
jest.mock('features/navigation/TabBar/tabBarRoutes')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('<SearchLanding />', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
      setFeatureFlags()
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
