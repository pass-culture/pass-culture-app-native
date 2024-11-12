import React from 'react'

import { searchResponseOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import * as fetchCinemaOffersModule from 'features/search/pages/Search/ThematicSearch/Cinema/algolia/fetchCinemaOffers'
import { PlaylistsThematicSearchCinema } from 'features/search/pages/Search/ThematicSearch/Cinema/PlaylistsThematicSearchCinema'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, GeolocationError, GeolocPermissionState } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.unmock('react-native/Libraries/Animated/createAnimatedComponent')

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)
const DEFAULT_POSITION = { latitude: 66, longitude: 66 } as GeoCoordinates | null
const mockPositionError = null as GeolocationError | null
const defaultUseLocation = {
  permissionState: GeolocPermissionState.GRANTED,
  geolocPosition: DEFAULT_POSITION,
  geolocPositionError: mockPositionError,
  triggerPositionUpdate: jest.fn(),
  showGeolocPermissionModal: jest.fn(),
  requestGeolocPermission: jest.fn(),
}
const mockUseLocation = jest.fn(() => defaultUseLocation)
jest.mock('libs/location/LocationWrapper', () => ({
  useLocation: () => mockUseLocation(),
}))

const cinemaOffer = searchResponseOfferBuilder().build()

const fetchOffersSpy = jest
  .spyOn(fetchCinemaOffersModule, 'fetchCinemaOffers')
  .mockResolvedValue([cinemaOffer])

describe('Cinema', () => {
  // TODO(PC-32938): Fix this test
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render playlist when algolia returns offers', async () => {
    fetchOffersSpy.mockResolvedValueOnce([cinemaOffer])
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchCinema')

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    fetchOffersSpy.mockResolvedValueOnce([])
    renderCinema()

    await screen.findByTestId('playlistsThematicSearchCinema')

    expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<PlaylistsThematicSearchCinema />))
