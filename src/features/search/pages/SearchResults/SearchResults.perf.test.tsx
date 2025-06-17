import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import algoliasearch from '__mocks__/algoliasearch'
import { SubcategoriesResponseModelv2 } from 'api/gen'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { mockSuggestionHits } from 'features/search/fixtures/algolia'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, measurePerformance } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/src/private/animated/NativeAnimatedHelper')

jest.mock('react-instantsearch-core', () => ({
  ...jest.requireActual('react-instantsearch-core'),
  // API key used for test does not exist so we need to mock this part
  useInstantSearch: () => ({
    use: jest.fn(),
  }),
  // We mock this hook to simulate autocomplete suggestions
  useInfiniteHits: () => ({ hits: mockSuggestionHits }),
}))

// Performance measuring is run multiple times so we need to increase the timeout
const TEST_TIMEOUT_IN_MS = 30_000
jest.setTimeout(TEST_TIMEOUT_IN_MS)

describe('<SearchResults />', () => {
  describe('Search Results -', () => {
    beforeAll(() => {
      algoliasearch().initIndex().search.mockResolvedValue(mockedAlgoliaResponse)
      useRoute.mockReturnValue({ params: { query: 'test' } })
    })

    beforeEach(() => {
      setFeatureFlags()
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    })

    it('Performance test for Search Results page', async () => {
      await measurePerformance(<SearchPage />, {
        scenario: async () => {
          await act(async () => {})
        },
      })
    })
  })
})

const SearchPage = () =>
  reactQueryProviderHOC(
    <SearchWrapper>
      <SearchResults />
    </SearchWrapper>
  )
