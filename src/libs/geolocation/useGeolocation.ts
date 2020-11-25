import { useEffect, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { getPosition } from './getPosition'

export const useGeolocation = (): GeoCoordinates | null => {
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)

  useEffect(() => {
    getPosition(setInitialPosition)
  }, [])

  return position
}
