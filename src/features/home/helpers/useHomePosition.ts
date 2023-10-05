import { useLocation } from 'libs/geolocation'

export const useHomePosition = () => {
  const { userPosition, customPosition } = useLocation()

  return { position: customPosition || userPosition }
}
