import { PermissionsAndroid } from 'react-native'

export const useRequestGeolocPermission = (setPermissionGranted: (granted: boolean) => void) => {
  const requestPermissionRoutine = () => {
    requestGeolocPermission().then((granted) => {
      if (granted) setPermissionGranted(true)
    })
  }

  return {
    requestPermissionRoutine,
  }
}

export const requestGeolocPermission = async (): Promise<boolean> => {
  const permissions = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ])
  if (
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' ||
    permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted'
  ) {
    return true
  }
  return false
}
