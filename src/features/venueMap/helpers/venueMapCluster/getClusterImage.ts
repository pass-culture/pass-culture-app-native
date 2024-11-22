import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { CLUSTER_IMAGE_COLOR_NAME } from 'features/venueMap/constant'

export const getClusterImage = (
  points: number,
  color: ClusterImageColorName = CLUSTER_IMAGE_COLOR_NAME.BLUE
) => {
  if (points < 2) {
    return undefined
  }

  return points > 9 ? `map_pin_cluster_${color}_9plus` : `map_pin_cluster_${color}_${points}`
}
