import React from 'react'

import { searchResponseOfferBuilder } from 'features/offer/components/MoviesScreeningCalendar/offersStockResponse.builder'
import * as fetchCinemaOffersModule from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/fetchCinemaOffers'
import { Cinema } from 'features/search/pages/Search/SearchN1/category/Cinema/Cinema'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, GeolocationError, GeolocPermissionState } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/firebase/analytics/analytics')
jest.mock('@batch.com/react-native-plugin', () =>
  jest.requireActual('__mocks__/libs/react-native-batch')
)
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
  it('should render playlist when algolia returns offers', async () => {
    fetchOffersSpy.mockResolvedValueOnce([cinemaOffer])
    renderCinema()

    await screen.findByTestId('cinema')

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    fetchOffersSpy.mockResolvedValueOnce([])
    renderCinema()

    await screen.findByTestId('cinema')

    expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<Cinema />))
