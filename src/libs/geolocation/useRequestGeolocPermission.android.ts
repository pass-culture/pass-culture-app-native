import { useEffect } from 'react'
import { PermissionsAndroid } from 'react-native'

export const useRequestGeolocPermission = () => {
  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
  }, [])
}
