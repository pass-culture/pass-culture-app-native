import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import algoliasearch from '__mocks__/algoliasearch'
import { SearchWrapper } from 'features/search/context/SearchWrapper'
import { Search } from 'features/search/pages/Search/Search'
import { SearchView } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { measurePerformance, screen } from 'tests/utils'

jest.unmock('features/search/context/SearchWrapper')

jest.mock('react-instantsearch-hooks', () => ({
  ...jest.requireActual('react-instantsearch-hooks'),
  // API key used for test does not exist so we need to mock this part
  useInstantSearch: () => ({
    use: jest.fn(),
  }),
}))

describe('<Search />', () => {
  describe('Landing Page', () => {
    beforeAll(() => {
      useRoute.mockReturnValue({ params: { view: SearchView.Landing } })
    })

    it('Performance test for Search Landing page', async () => {
      await measurePerformance(<SearchPage />, {
        scenario: async () => {
          await screen.findByText('Spectacles') // Last category that is rendered
        },
      })
    })
  })

  describe('Search Results', () => {
    beforeAll(() => {
      algoliasearch().initIndex().search.mockResolvedValue(mockedAlgoliaResponse)
      useRoute.mockReturnValue({ params: { view: SearchView.Results, query: 'test' } })
    })

    it('Performance test for Search Results page', async () => {
      await measurePerformance(<SearchPage />, {
        scenario: async () => {
          await screen.findByText('4 résultats')
        },
      })
    })
  })
})

const SearchPage = () =>
  // eslint-disable-next-line local-rules/no-react-query-provider-hoc
  reactQueryProviderHOC(
    <SearchWrapper>
      <Search />
    </SearchWrapper>
  )
