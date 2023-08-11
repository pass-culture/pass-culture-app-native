import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchHeader } from 'features/search/components/SearchHeader/SearchHeader'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { render, screen } from 'tests/utils'

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

jest.mock('react-instantsearch-hooks', () => ({
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

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it('should render SearchHeader', async () => {
    render(<SearchHeader searchInputID={searchInputID} />)

    await screen.findByText('Recherche une offre')

    expect(screen).toMatchSnapshot()
  })
})
