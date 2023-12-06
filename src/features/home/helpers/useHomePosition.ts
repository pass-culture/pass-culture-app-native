import { Position, useLocation } from 'libs/location'

export const useHomePosition = () => {
  const { geolocPosition, place } = useLocation()

  const placeCoordinates: Position = place?.geolocation

  return { position: placeCoordinates || geolocPosition }
}
