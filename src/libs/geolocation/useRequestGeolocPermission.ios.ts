import { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service'

export const useRequestGeolocPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  useEffect(() => {
    requestGeolocPermission().then((granted) => {
      if (granted) setPermissionGranted(true)
    })
  }, [])

  return permissionGranted
}

export const requestGeolocPermission = (): Promise<boolean> =>
  Geolocation.requestAuthorization('whenInUse').then((value) => {
    if (value === 'granted') return true
    return false
  })
