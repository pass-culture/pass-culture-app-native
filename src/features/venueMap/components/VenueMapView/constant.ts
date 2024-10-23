import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { getSpacing } from 'ui/theme'

export const FILTER_BANNER_HEIGHT = getSpacing(12)
export const MARKER_LABEL_MARGIN_TOP = getSpacing(1)
export const MARKER_SIZE = { width: 44, height: 50 }
export const MARKER_LABEL_VISIBILITY_LIMIT = {
  altitude: 4000,
  zoom: 13,
}

export const CLUSTER_IMAGE_COLOR_NAME = {
  BLUE: 'blue',
  ORANGE: 'orange',
  PINK: 'pink',
} satisfies Record<string, ClusterImageColorName>
