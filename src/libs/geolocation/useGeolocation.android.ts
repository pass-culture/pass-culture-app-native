import { useEffect, useState } from 'react'
import { Alert, PermissionsAndroid } from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { getPosition } from './getPosition'

export const useGeolocation = (): GeoCoordinates | null => {
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)

  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ])
      .then(() => getPosition(setInitialPosition))
      .catch((error) => Alert.alert('Error Permission', JSON.stringify(error)))
  }, [])

  return position
}
