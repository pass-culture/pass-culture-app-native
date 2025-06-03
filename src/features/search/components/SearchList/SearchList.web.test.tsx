import React from 'react'

import { SearchList } from 'features/search/components/SearchList/SearchList'
import { getHeaderSize } from 'features/search/components/SearchList/SearchList.web'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchListProps } from 'features/search/types'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

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

const WIDTH_MOCK = 465

const mockUseWindowDimensions = jest.fn().mockReturnValue({
  width: WIDTH_MOCK,
  scale: 1,
  fontScale: 1,
})
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: mockUseWindowDimensions,
}))

describe('<SearchList />', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should display search list header when number of offer results > 0', async () => {
    render(reactQueryProviderHOC(<SearchList {...props} />))

    expect(screen.getByTestId('searchListHeader')).toBeInTheDocument()
  })
})

describe('getHeaderSize', () => {
  it.each`
    userData                    | isGeolocated | hasVenuesPlaylist | windowWidth | hasArtistsPlaylist | expected
    ${undefined}                | ${true}      | ${false}          | ${465}      | ${false}           | ${112}
    ${undefined}                | ${false}     | ${false}          | ${465}      | ${false}           | ${218}
    ${undefined}                | ${false}     | ${false}          | ${464}      | ${false}           | ${242}
    ${undefined}                | ${false}     | ${true}           | ${464}      | ${false}           | ${539}
    ${undefined}                | ${true}      | ${true}           | ${464}      | ${false}           | ${409}
    ${[{ message: 'coucou ' }]} | ${false}     | ${false}          | ${464}      | ${false}           | ${184}
    ${[{ message: 'coucou ' }]} | ${false}     | ${true}           | ${464}      | ${true}            | ${781}
  `(
    'getHeaderSize should render correct header size',
    ({ userData, isGeolocated, hasVenuesPlaylist, windowWidth, hasArtistsPlaylist, expected }) => {
      expect(
        getHeaderSize({
          userData,
          isGeolocated,
          hasVenuesPlaylist,
          windowWidth,
          hasArtistsPlaylist,
        })
      ).toBe(expected)
    }
  )
})
