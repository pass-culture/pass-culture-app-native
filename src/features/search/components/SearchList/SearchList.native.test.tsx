import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { SearchListProps } from 'features/search/types'
import {
  mockedAlgoliaResponse,
  mockedAlgoliaVenueResponse,
} from 'libs/algolia/__mocks__/mockedAlgoliaResponse'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { render } from 'tests/utils'

jest.mock('react-query')

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

const mockSearchVenuesState = mockedAlgoliaVenueResponse
jest.mock('features/search/context/SearchVenuesWrapper', () => ({
  useSearchVenues: () => ({
    searchVenuesState: mockSearchVenuesState,
    dispatch: jest.fn(),
  }),
}))

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

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
  it('should renders correctly', async () => {
    render(<SearchList {...props} />)

    expect(renderItem).toHaveBeenCalledWith({
      item: mockedAlgoliaResponse.hits[0],
      index: 0,
      target: 'Cell',
    })
  })
})
