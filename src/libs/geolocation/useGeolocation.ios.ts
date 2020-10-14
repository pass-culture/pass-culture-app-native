import { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import AgonTukGeolocation, { GeoCoordinates } from 'react-native-geolocation-service'

import { getPosition } from './getPosition'

export const useGeolocation = (): GeoCoordinates | null => {
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)

  useEffect(() => {
    AgonTukGeolocation.requestAuthorization('whenInUse')
      .then(() => getPosition(setInitialPosition))
      .catch((error) => Alert.alert('Error', JSON.stringify(error)))
  }, [])

  return position
}
