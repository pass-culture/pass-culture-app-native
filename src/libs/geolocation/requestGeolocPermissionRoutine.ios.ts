import Geolocation from 'react-native-geolocation-service'

export const requestGeolocPermissionRoutine = async (onGranted: (granted: boolean) => void) => {
  const granted = await requestGeolocPermission()
  if (granted) onGranted(true)
}

export const requestGeolocPermission = (): Promise<boolean> =>
  Geolocation.requestAuthorization('whenInUse').then((value) => {
    if (value === 'granted') return true
    return false
  })
