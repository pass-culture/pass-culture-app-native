import Geolocation from 'react-native-geolocation-service'

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

export const requestGeolocPermission = (): Promise<boolean> =>
  Geolocation.requestAuthorization('whenInUse').then((value) => {
    if (value === 'granted') return true
    return false
  })
