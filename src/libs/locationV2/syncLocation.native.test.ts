import { GeolocPermissionState, GeolocPositionError } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { GeolocationError, LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { syncLocation } from 'libs/locationV2/syncLocation'

jest.mock('libs/location/geolocation/getGeolocPosition/getGeolocPosition')
const mockGetGeolocPosition = jest.mocked(getGeolocPosition)

const position = { latitude: 48.85, longitude: 2.35 }

describe('syncLocation', () => {
  it('should do nothing when permission is not GRANTED', async () => {
    locationActions.setPermissionState(GeolocPermissionState.DENIED)

    await syncLocation()

    expect(mockGetGeolocPosition).not.toHaveBeenCalled()
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
