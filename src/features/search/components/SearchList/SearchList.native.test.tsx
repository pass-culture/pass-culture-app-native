import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaHitsResponse } from 'libs/algolia/__mocks__/mockedAlgoliaHitResponse'
import { Offer } from 'shared/offer/types'
import { render } from 'tests/utils'

jest.mock('react-query')

const mockHits: Offer[] = mockedAlgoliaHitsResponse.hits
const mockNbHits = mockedAlgoliaHitsResponse.nbHits

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
    userData: [],
  }
  it('should renders correctly', () => {
    render(<SearchList {...props} />)

    expect(renderItem).toHaveBeenCalledWith({
      item: mockedAlgoliaHitsResponse.hits[0],
      index: 0,
      target: 'Cell',
    })
  })
})
