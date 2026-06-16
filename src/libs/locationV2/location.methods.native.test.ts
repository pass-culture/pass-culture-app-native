import { AppState } from 'react-native'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { LocationMode } from 'libs/location/types'
import { initLocationPermission } from 'libs/locationV2/location.methods'
import { locationActions, locationSelectors } from 'libs/locationV2/location.store'
import { waitFor } from 'tests/utils'

jest.mock('libs/location/geolocation/checkGeolocPermission/checkGeolocPermission')
const mockCheckGeolocPermission = jest.mocked(checkGeolocPermission)

describe('location methods', () => {
  describe('initLocationPermission', () => {
    describe('when app starts', () => {
      it('should set location mode to EVERYWHERE if permission is not GRANTED', async () => {
        locationActions.setLocationMode(LocationMode.AROUND_ME)
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)

        initLocationPermission()

        await waitFor(() => {
          expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
        })
      })

      it('should keep location mode if permission is GRANTED', async () => {
        locationActions.setLocationMode(LocationMode.AROUND_ME)
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

        initLocationPermission()

        await waitFor(() => {
          expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
        })
      })
    })

    describe('when app is resumed', () => {
      it('should set location mode to EVERYWHERE if permission is not GRANTED', async () => {
        locationActions.setLocationMode(LocationMode.AROUND_ME)
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

        initLocationPermission()

        AppState.__triggerChange('inactive')
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.DENIED)
        AppState.__triggerChange('active')

        await waitFor(() => {
          expect(locationSelectors.selectLocationMode()).toBe(LocationMode.EVERYWHERE)
        })
      })

      it('should keep location mode if permission is GRANTED', async () => {
        locationActions.setLocationMode(LocationMode.AROUND_ME)
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)

        initLocationPermission()

        AppState.__triggerChange('inactive')
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
        AppState.__triggerChange('active')

        await waitFor(() => {
          expect(locationSelectors.selectLocationMode()).toBe(LocationMode.AROUND_ME)
        })
      })

      it('should hide permission modal if permission is GRANTED', async () => {
        locationActions.setLocationMode(LocationMode.EVERYWHERE)
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.NEVER_ASK_AGAIN)

        initLocationPermission()
        locationActions.showPermissionModal()

        AppState.__triggerChange('inactive')
        mockCheckGeolocPermission.mockResolvedValueOnce(GeolocPermissionState.GRANTED)
        AppState.__triggerChange('active')

        await waitFor(() => {
          expect(locationSelectors.selectIsPermissionModalVisible()).toBe(false)
        })
      })
    })
  })
})
