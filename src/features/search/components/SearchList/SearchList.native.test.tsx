import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { SearchListProps } from 'features/search/components/SearchResults/type'
import { UserData } from 'features/search/types'
import { SearchHit } from 'libs/algolia'
import { mockedAlgoliaResponse } from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import { render } from 'tests/utils'

jest.mock('react-query')

const mockData = {
  pages: [
    {
      nbHits: 0,
      hits: [],
      page: 0,
    },
  ],
}
const mockHits: SearchHit[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits
const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
const mockUserData: UserData[] = []
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: mockHits,
    nbHits: mockNbHits,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
    userData: mockUserData,
  }),
}))

describe('<SearchList />', () => {
  const renderItem = jest.fn()

  const props: SearchListProps = {
    nbHits: mockNbHits,
    hits: mockHits,
    renderItem,
    autoScrollEnabled: true,
    refreshing: false,
    onRefresh: jest.fn(),
    isFetchingNextPage: false,
    onEndReached: jest.fn(),
    onScroll: jest.fn(),
  }
  it('should renders correctly', () => {
    render(<SearchList {...props} />)

    expect(renderItem).toHaveBeenCalledWith({
      item: mockedAlgoliaResponse.hits[0],
      index: 0,
      target: 'Cell',
    })
  })
})
