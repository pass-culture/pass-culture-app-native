import { Route } from '@react-navigation/native'
import React from 'react'

import { usePreviousRoute } from 'features/navigation/helpers/__mocks__/usePreviousRoute'
import { SearchList } from 'features/search/components/SearchList/SearchList'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Offer } from 'shared/offer/types'
import { render } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

const mockUsePreviousRoute: jest.Mock<Route<string> | null> = usePreviousRoute

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('@shopify/flash-list', () => {
  const ActualFlashList = jest.requireActual('@shopify/flash-list').FlashList
  class MockFlashList extends ActualFlashList {
    componentDidMount() {
      super.componentDidMount()
      this.rlvRef?._scrollComponent?._scrollViewRef?.props?.onLayout({
        nativeEvent: { layout: { height: 250, width: 800 } },
      })
    }
  }
  return {
    ...jest.requireActual('@shopify/flash-list'),
    FlashList: MockFlashList,
  }
})

describe('<SearchList />', () => {
  beforeEach(() => mockUsePreviousRoute.mockReturnValue({ name: 'SomeScreen', key: 'key' }))

  const renderItem = jest.fn()

  const props: SearchListProps = {
    nbHits: mockNbHits,
    hits: { offers: mockHits, venues: [], duplicatedOffers: mockHits, artists: [] },
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
