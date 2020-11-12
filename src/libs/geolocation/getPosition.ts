import AgonTukGeolocation, { GeoCoordinates } from 'react-native-geolocation-service'

export const getPosition = (setInitialPosition: (coordinates: GeoCoordinates) => void): void =>
  AgonTukGeolocation.getCurrentPosition(
    (position) => setInitialPosition(position.coords),
    undefined,
    { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
  )
