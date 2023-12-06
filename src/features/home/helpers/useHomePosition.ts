import { useLocation } from 'libs/location'

export const useHomePosition = () => {
  const { userPosition, customPosition } = useLocation()

  return { position: customPosition || userPosition }
}
