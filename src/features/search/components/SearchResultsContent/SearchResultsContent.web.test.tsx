import { Hit } from 'algoliasearch/lite'
import { uniqBy } from 'lodash'
import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import { transformOfferHit } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { AlgoliaOffer, AlgoliaVenue } from 'libs/algolia/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { remoteConfigResponseFixture } from 'libs/firebase/remoteConfig/fixtures/remoteConfigResponse.fixture'
import * as useRemoteConfigQuery from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { GeoCoordinates, Position } from 'libs/location/location'
import { useVenuesInRegionQuery } from 'queries/venueMap/useVenuesInRegionQuery'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils/web'

import { SearchResultsContent, SearchResultsContentProps } from './SearchResultsContent'

const DEFAULT_SEARCH_RESULT_CONTENT_PROPS = {
  isFetching: false,
  isLoading: false,
  isFetchingNextPage: false,
  userData: [],
  onEndReached: jest.fn(),
  onSearchResultsRefresh: jest.fn(),
  venuesUserData: [],
  offerVenues: venuesFixture,
  hits: {
    offers: mockedAlgoliaResponse.hits.map(transformOfferHit('')),
    artists: uniqBy(
      mockedAlgoliaResponse.hits.flatMap((hit: Hit<AlgoliaOffer>) => hit.artists ?? []),
      'name'
    ),
    duplicatedOffers: [],
    venues: mockedAlgoliaResponse.hits.map((hit: Hit<AlgoliaOffer>) => ({
      ...hit.venue,
      _geoloc: hit._geoloc,
    })) as AlgoliaVenue[],
  },
  nbHits: mockedAlgoliaResponse.hits.length,
} satisfies SearchResultsContentProps

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
const mockPosition: Position = DEFAULT_POSITION
const mockShowGeolocPermissionModal = jest.fn()

jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => ({
    geolocPosition: mockPosition,
    showGeolocPermissionModal: mockShowGeolocPermissionModal,
  }),
}))

jest.mock('queries/venueMap/useVenuesInRegionQuery')
const mockUseVenuesInRegionQuery = useVenuesInRegionQuery as jest.Mock

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

jest.mock('features/location/helpers/useLocationState', () => ({
  useLocationState: () => ({
    onModalHideRef: { current: jest.fn() },
  }),
}))

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('queries/venue/useVenueOffersQuery')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('features/navigation/helpers/usePreviousRoute', () => ({
  usePreviousRoute: () => ({ name: 'ThematicSearch' }),
}))

jest
  .spyOn(useRemoteConfigQuery, 'useRemoteConfigQuery')
  .mockReturnValue(remoteConfigResponseFixture)

describe('SearchResultsContent component', () => {
  beforeEach(() => {
    mockUseVenuesInRegionQuery.mockReturnValue({ data: venuesFixture })
    mockUseCenterOnLocation.mockReturnValue(jest.fn())
  })

  it('should not render tabs on web when feature flag map in search activated', async () => {
    setFeatureFlags([
      RemoteStoreFeatureFlags.WIP_VENUE_MAP_IN_SEARCH,
      RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY,
    ])
    render(reactQueryProviderHOC(<SearchResultsContent {...DEFAULT_SEARCH_RESULT_CONTENT_PROPS} />))

    await screen.findByTestId('searchResultsFlashlist')

    expect(screen.queryByText('Liste')).not.toBeOnTheScreen()
    expect(screen.queryByText('Carte')).not.toBeOnTheScreen()
  })
})
