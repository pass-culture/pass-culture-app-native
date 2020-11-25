import { useEffect } from 'react'
import Geolocation from 'react-native-geolocation-service'

export const useRequestGeolocPermission = () => {
  useEffect(() => {
    Geolocation.requestAuthorization('whenInUse')
  }, [])
}
