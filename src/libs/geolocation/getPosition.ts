import { Alert } from 'react-native'
import AgonTukGeolocation, { GeoCoordinates } from 'react-native-geolocation-service'

export const getPosition = (setInitialPosition: (coordinates: GeoCoordinates) => void): void =>
  AgonTukGeolocation.getCurrentPosition(
    (position) => setInitialPosition(position.coords),
    (error) => Alert.alert('Error', JSON.stringify(error)),
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
  )
