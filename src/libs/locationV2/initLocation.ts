import { AppState } from 'react-native'

import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/__mocks__/checkGeolocPermission'
import { locationActions } from 'libs/locationV2/location.store'
import { syncLocation } from 'libs/locationV2/syncLocation'

/**
 * Initialize location
 * - Sync geolocation permission
 * - Sync location if permission is granted
 * - Listen to app state changes and sync location if app is resumed
 * > ⚠️ Must be called only once at app startup
 */
export const initLocation = () => {
  void syncPermissionsAndLocation()
  return AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      void syncPermissionsAndLocation()
    }
  })
}

const syncPermissionsAndLocation = async () => {
  const permission = await checkGeolocPermission()
  locationActions.setPermissionState(permission)
  void syncLocation()
}
