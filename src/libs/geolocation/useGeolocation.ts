import Geolocation from '@react-native-community/geolocation'
import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

import { GeoLocationCoordinates } from './types'

export const useGeolocation = (): GeoLocationCoordinates => {
  const [position, setInitialPosition] = useState<GeoLocationCoordinates>({})

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (currentPosition) => setInitialPosition(currentPosition.coords),
      (error) => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
  }, [])

  return position
}
