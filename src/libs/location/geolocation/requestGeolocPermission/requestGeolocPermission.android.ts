import { PermissionsAndroid, PermissionStatus } from 'react-native'
import { promptForEnableLocationIfNeeded } from 'react-native-android-location-enabler'

import { AskGeolocPermission } from 'libs/location/types'

import { GeolocPermissionState } from '../enums'

const { ACCESS_FINE_LOCATION, ACCESS_COARSE_LOCATION } = PermissionsAndroid.PERMISSIONS
const { GRANTED, NEVER_ASK_AGAIN } = PermissionsAndroid.RESULTS

export const requestGeolocPermission: AskGeolocPermission = async () => {
  const statuses = await requestLocationPermissions()

  if (statuses.includes(GRANTED)) return enableLocationIfNeeded()
  if (statuses.includes(NEVER_ASK_AGAIN)) return GeolocPermissionState.NEVER_ASK_AGAIN
  return GeolocPermissionState.DENIED
}

const enableLocationIfNeeded = async (): Promise<GeolocPermissionState> => {
  try {
    await promptForEnableLocationIfNeeded()
    return GeolocPermissionState.GRANTED
  } catch {
    return GeolocPermissionState.DENIED
  }
}

const requestLocationPermissions = async (): Promise<PermissionStatus[]> => {
  const statuses = await PermissionsAndroid.requestMultiple([
    ACCESS_FINE_LOCATION,
    ACCESS_COARSE_LOCATION,
  ])
  return [statuses[ACCESS_FINE_LOCATION], statuses[ACCESS_COARSE_LOCATION]]
}
