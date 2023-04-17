import { useGeolocation } from 'libs/geolocation'

export const useHomePosition = () => {
  const { userPosition, customPosition } = useGeolocation()

  return { position: customPosition ? customPosition : userPosition }
}
