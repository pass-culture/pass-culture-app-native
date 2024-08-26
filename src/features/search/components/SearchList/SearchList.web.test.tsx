import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlag from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

jest.spyOn(useFeatureFlag, 'useFeatureFlag').mockReturnValue(true)

jest.mock('features/search/helpers/useScrollToBottomOpacity/useScrollToBottomOpacity', () => ({
  useScrollToBottomOpacity: () => ({
    handleScroll: jest.fn(),
  }),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

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

  it('should display search list header when number of offer results > 0', async () => {
    render(reactQueryProviderHOC(<SearchList {...props} />))

    expect(screen.getByTestId('searchListHeader')).toBeInTheDocument()
  })

  it('should not display search list header when number of offer results = 0', async () => {
    const propsWithoutHits = {
      ...props,
      nbHits: 0,
      hits: { offers: [], venues: [], duplicatedOffers: [] },
    }
    render(reactQueryProviderHOC(<SearchList {...propsWithoutHits} />))

    expect(screen.queryByTestId('searchListHeader')).not.toBeInTheDocument()
  })
})
