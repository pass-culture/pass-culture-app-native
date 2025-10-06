import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { SearchListHeader } from 'features/search/components/SearchListHeader/SearchListHeader'
import { initialSearchState } from 'features/search/context/reducer'
import { mockAlgoliaVenues } from 'features/search/fixtures/mockAlgoliaVenues'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { convertAlgoliaVenue2AlgoliaVenueOfferListItem } from 'features/search/helpers/searchList/getReconciledVenues'
import { SearchState } from 'features/search/types'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeoCoordinates } from 'libs/location/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { render, screen } from 'tests/utils/web'

const searchId = uuidv4()

const DEFAULT_POSITION = { latitude: 2, longitude: 40 } as GeoCoordinates
const mockPosition: GeoCoordinates | null = DEFAULT_POSITION

const mockUseLocation: jest.Mock<Partial<ILocationContext>> = jest.fn(() => ({
  geolocPosition: mockPosition,
  selectedLocationMode: LocationMode.EVERYWHERE,
}))
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockSearchState: SearchState = initialSearchState
const mockUseSearch = jest.fn(() => ({
  searchState: initialSearchState,
}))
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('ui/theme/customFocusOutline/customFocusOutline')

jest.mock('features/location/helpers/useLocationState', () => ({
  useLocationState: () => ({
    onModalHideRef: { current: jest.fn() },
  }),
}))

const mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

// FIXME(PC-37597): un-skip flaky tests
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('<SearchListHeader />', () => {
  describe('When wipVenueMap feature flag activated', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
    })

    it('should not display see map button when user location mode is around me and there is a venues playlist', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: { locationType: LocationMode.AROUND_ME, aroundRadius: MAX_RADIUS },
        },
      })
      mockUseLocation.mockReturnValueOnce({
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_ME,
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)}
        />
      )

      expect(
        screen.queryByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)
      ).not.toBeOnTheScreen()
    })

    it('should not display see map button when user location mode is around place and there is a venues playlist', () => {
      mockUseSearch.mockReturnValueOnce({
        searchState: {
          ...mockSearchState,
          searchId,
          locationFilter: {
            locationType: LocationMode.AROUND_PLACE,
            place: kourou,
            aroundRadius: MAX_RADIUS,
          },
        },
      })
      mockUseLocation.mockReturnValueOnce({
        geolocPosition: mockPosition,
        selectedLocationMode: LocationMode.AROUND_PLACE,
      })

      render(
        <SearchListHeader
          nbHits={10}
          userData={[]}
          venuesUserData={[]}
          venues={mockAlgoliaVenues.map(convertAlgoliaVenue2AlgoliaVenueOfferListItem)}
        />
      )

      expect(
        screen.queryByText(`Voir sur la carte (${mockAlgoliaVenues.length})`)
      ).not.toBeOnTheScreen()
    })
  })
})
