import { GeolocPermissionState, GeolocPositionError } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { GeolocationError, LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { locationModalSelectors } from 'libs/locationV2/locationModal.store'
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

  describe('location mode', () => {
    it('should switch to AROUND_ME when a position is found and the user has not chosen a mode', async () => {
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce(position)

      await syncLocation()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
    })

    it('should keep EVERYWHERE when the user has chosen it', async () => {
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce(position)

      await syncLocation()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
    })

    it('should keep AROUND_PLACE when a position is found', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce(position)

      await syncLocation()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
    })

    it('should fall back to EVERYWHERE when no position is found and the user has not chosen a mode', async () => {
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce(position)
      await syncLocation()
      mockGetGeolocPosition.mockRejectedValueOnce({ cause: null })

      await syncLocation()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
    })

    it('should follow the position again once permission loss has forced EVERYWHERE', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      locationActions.setPermissionState(GeolocPermissionState.DENIED)
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      mockGetGeolocPosition.mockResolvedValueOnce(position)

      await syncLocation()

      expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
    })
  })
})
