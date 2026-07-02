import { AppState } from 'react-native'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { LocationMode } from 'libs/location/types'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { queryClient } from 'libs/react-query/queryClient'
import { mockServer } from 'tests/mswServer'
import { waitFor } from 'tests/utils'

import { initLocation } from './initLocation'

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = jest.mocked(checkGeolocPermission)

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

describe('initLocation', () => {
  beforeEach(() => {
    queryClient.clear()
    mockServer.universalGet(REVERSE_GEOCODE_URL, mockReverseGeocodeResponse)
  })

  describe('when app starts', () => {
    it('should switch to around place with last known position if permission is not GRANTED', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      locationActions.setGeolocPosition(position)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

      initLocation()

      await waitFor(() => {
        expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
      })

      expect(locationSelectors.selectLocationConfiguration(LocationMode.AROUND_PLACE)).toEqual(
        expect.objectContaining({
          geolocation: position,
          label: 'Paris',
        })
      )
    })

    it('should keep location mode if permission is GRANTED', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      initLocation()

      await waitFor(() => {
        expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
      })
    })
  })

  describe('when app is resumed', () => {
    it('should switch to around place with last known position if permission is not GRANTED', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      locationActions.setGeolocPosition(position)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      initLocation()

      AppState.__triggerChange('inactive')
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)
      AppState.__triggerChange('active')

      await waitFor(() => {
        expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_PLACE)
      })
    })

    it('should keep location mode if permission is GRANTED', async () => {
      locationActions.setLocationMode(LocationMode.AROUND_ME)
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

      initLocation()

      AppState.__triggerChange('inactive')
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      AppState.__triggerChange('active')

      await waitFor(() => {
        expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
      })
    })

    it('should update permission state when app becomes active', async () => {
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)

      initLocation()

      await waitFor(() => {
        expect(locationSelectors.selectPermissionState()).toBe(
          GeolocPermissionState.NEVER_ASK_AGAIN
        )
      })

      AppState.__triggerChange('inactive')
      mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
      AppState.__triggerChange('active')

      await waitFor(() => {
        expect(locationSelectors.selectPermissionState()).toBe(GeolocPermissionState.GRANTED)
      })
    })
  })
})
