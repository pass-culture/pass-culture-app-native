import { useEffect, useState } from 'react'
import Geolocation from 'react-native-geolocation-service'

export const useRequestGeolocPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  useEffect(() => {
    Geolocation.requestAuthorization('whenInUse').then((value) => {
      if (value === 'granted') setPermissionGranted(true)
    })
  }, [])

  return permissionGranted
}
