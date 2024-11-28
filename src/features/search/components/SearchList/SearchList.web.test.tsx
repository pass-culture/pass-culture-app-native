import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

const mockHits: Offer[] = mockedAlgoliaResponse.hits
const mockNbHits = mockedAlgoliaResponse.nbHits

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

describe('<SearchList />', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

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

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}
