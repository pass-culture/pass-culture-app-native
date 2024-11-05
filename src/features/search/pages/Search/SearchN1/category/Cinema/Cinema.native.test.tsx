import React from 'react'

import { fetchCinemaOffers } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/fetchCinemaOffers'
import { Cinema } from 'features/search/pages/Search/SearchN1/category/Cinema/Cinema'
import { cinemaPlaylistAlgoliaSnapshot } from 'features/search/pages/Search/SearchN1/category/Cinema/fixtures/cinemaPlaylistAlgoliaSnapshot'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { GeoCoordinates, GeolocationError, GeolocPermissionState } from 'libs/location'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, render, screen } from 'tests/utils'

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')
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

jest.mock('features/search/pages/Search/SearchN1/category/Cinema/algolia/fetchCinemaOffers')
const mockFetchCinemaOffers = fetchCinemaOffers as jest.Mock
mockFetchCinemaOffers.mockResolvedValue(cinemaPlaylistAlgoliaSnapshot)

describe('Cinema', () => {
  it('should render playlist when algolia returns offers', async () => {
    renderCinema()
    await act(() => {})

    expect(await screen.findByText('Films à l’affiche')).toBeOnTheScreen()
  })

  it('should not render playlist when algolia does not return offers', async () => {
    mockFetchCinemaOffers.mockResolvedValueOnce([])

    renderCinema()

    expect(screen.queryByText('Films à l’affiche')).not.toBeOnTheScreen()
  })
})

const renderCinema = () => render(reactQueryProviderHOC(<Cinema />))
