import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { getSpacing } from 'ui/theme'

export const FILTER_BANNER_HEIGHT = getSpacing(12)
export const CLUSTER_IMAGE_COLOR_NAME = {
  BLUE: 'blue',
  ORANGE: 'orange',
  PINK: 'pink',
} satisfies Record<string, ClusterImageColorName>
