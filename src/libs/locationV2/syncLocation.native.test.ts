import { GeolocPermissionState, GeolocPositionError } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { GeolocationError, LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalSelectors } from 'libs/locationV2/locationModal.store'
import { syncLocation } from 'libs/locationV2/syncLocation'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const mockGetGeolocPosition = jest.mocked(getGeolocPosition)

const REVERSE_GEOCODE_URL = 'https://data.geopf.fr/geocodage/reverse'
const position = { latitude: 48.85, longitude: 2.35 }

const mockReverseGeocodeResponse = {
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [position.longitude, position.latitude] as [number, number],
      },
      properties: {
        type: 'locality' as const,
        label: 'Paris',
      },
    },
  ],
}

describe('syncLocation', () => {
  beforeEach(() => {
    queryClient.clear()
  })

  it('should do nothing when permission is not GRANTED and mode is not AROUND_ME', async () => {
    locationActions.setPermissionState(GeolocPermissionState.DENIED)
    locationActions.setLocationMode(LocationMode.EVERYWHERE)

    await syncLocation()

    expect(mockGetGeolocPosition).not.toHaveBeenCalled()
    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
  })

  it('should switch to around place with last known position when permission is not GRANTED and mode is AROUND_ME', async () => {
    locationActions.setPermissionState(GeolocPermissionState.DENIED)
    locationActions.setLocationMode(LocationMode.AROUND_ME)
    locationActions.setGeolocPosition(position)
    mockServer.universalGet(REVERSE_GEOCODE_URL, mockReverseGeocodeResponse)

    await syncLocation()

    expect(mockGetGeolocPosition).not.toHaveBeenCalled()
    expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    expect(locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE)).toEqual(
      expect.objectContaining({
        geolocation: position,
        label: 'Paris',
        type: 'locality',
        info: '',
      })
    )
  })

  it('should set position and clear error when permission is GRANTED', async () => {
    locationActions.setPermissionState(GeolocPermissionState.GRANTED)
    mockGetGeolocPosition.mockResolvedValueOnce(position)

    await syncLocation()

    expect(
      locationSelectors.selectLocationConfiguration(LocationMode.AROUND_ME).geolocation
    ).toEqual(position)
    expect(locationSelectors.selectState().geolocationError).toBeNull()
  })

  it('should set location mode to EVERYWHERE when permission is not GRANTED', async () => {
    locationActions.setPermissionState(GeolocPermissionState.DENIED)

    await syncLocation()

    expect(locationModalSelectors.selectLocationMode()).toEqual(LocationMode.EVERYWHERE)
  })

  it('should clear position and set error when getGeolocPosition fails', async () => {
    locationActions.setPermissionState(GeolocPermissionState.GRANTED)
    const cause: GeolocationError = {
      type: GeolocPositionError.POSITION_UNAVAILABLE,
      message: 'error',
    }
    mockGetGeolocPosition.mockRejectedValueOnce({ cause })

    await syncLocation()

    expect(
      locationSelectors.selectLocationConfiguration(LocationMode.AROUND_ME).geolocation
    ).toBeNull()
    expect(locationSelectors.selectState().geolocationError).toEqual(cause)
  })
})
