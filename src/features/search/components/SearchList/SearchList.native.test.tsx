import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { render } from 'tests/utils'

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

describe('<SearchList />', () => {
  const renderItem = jest.fn()

  const props: SearchListProps = {
    nbHits: mockNbHits,
    hits: { offers: mockHits, venues: [], duplicatedOffers: mockHits },
    renderItem,
    autoScrollEnabled: true,
    refreshing: false,
    onRefresh: jest.fn(),
    isFetchingNextPage: false,
    onEndReached: jest.fn(),
    onScroll: jest.fn(),
    userData: [],
    venuesUserData: [],
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
