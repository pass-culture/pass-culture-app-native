import { PermissionsAndroid, PermissionStatus } from 'react-native'
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler'

import { navigationRef } from 'features/navigation/navigationRef'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { locationActions } from 'libs/locationV2/location.store'

import {
  GEOLOCATION_USER_ERROR_MESSAGE,
  GeolocPermissionState,
  GeolocPositionError,
} from '../enums'

const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS
const { GRANTED, NEVER_ASK_AGAIN } = PermissionsAndroid.RESULTS

export const requestGeolocPermission = async (onSuccess?: () => void) => {
  const statuses = await requestLocationPermissions()

  if (statuses.includes(GRANTED)) {
    try {
      await promptForEnableLocationIfNeeded()
      locationActions.setPermissionState(GeolocPermissionState.GRANTED)
      try {
        const position = await getGeolocPosition()
        locationActions.setGeolocPosition(position)
        console.log({ position })
        onSuccess?.()
      } catch (error) {
        locationActions.setGeolocationError({
          type: GeolocPositionError.POSITION_UNAVAILABLE,
          message: GEOLOCATION_USER_ERROR_MESSAGE[GeolocPositionError.POSITION_UNAVAILABLE],
        })
      }
    } catch {
      locationActions.setPermissionState(GeolocPermissionState.DENIED)
    }
  }
  if (statuses.includes(NEVER_ASK_AGAIN)) {
    locationActions.setPermissionState(GeolocPermissionState.NEVER_ASK_AGAIN)
    navigationRef.navigate('GeolocationActivationModal')
  }
}

const requestLocationPermissions = async (): Promise<PermissionStatus[]> => {
  const statuses = await PermissionsAndroid.requestMultiple([
    ACCESS_FINE_LOCATION,
    ACCESS_COARSE_LOCATION,
  ])
  return [statuses[ACCESS_FINE_LOCATION], statuses[ACCESS_COARSE_LOCATION]]
}
