import { useEffect, useState } from 'react'
import { PermissionsAndroid } from 'react-native'

export const useRequestGeolocPermission = () => {
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]).then((permissions) => {
      if (
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] === 'granted' ||
        permissions[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] === 'granted'
      ) {
        setPermissionGranted(true)
      }
    })
  }, [])

  return permissionGranted
}
