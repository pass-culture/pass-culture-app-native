import { VenueTypeCodeKey } from 'api/gen'
import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { CLUSTER_IMAGE_COLOR_NAME } from 'features/venueMap/constant'
import { VenueTypeCode } from 'libs/parsers/venueType'

const getClusterColorFromVenueType = (venueType?: VenueTypeCode): ClusterImageColorName => {
  switch (venueType) {
    case VenueTypeCodeKey.MOVIE:
    case VenueTypeCodeKey.TRAVELING_CINEMA:
    case VenueTypeCodeKey.FESTIVAL:
    case VenueTypeCodeKey.CONCERT_HALL:
    case VenueTypeCodeKey.PERFORMING_ARTS:
    case VenueTypeCodeKey.MUSEUM:
    case VenueTypeCodeKey.LIBRARY:
    case VenueTypeCodeKey.VISUAL_ARTS:
    case VenueTypeCodeKey.GAMES:
      return CLUSTER_IMAGE_COLOR_NAME.ORANGE
    case VenueTypeCodeKey.BOOKSTORE:
    case VenueTypeCodeKey.CREATIVE_ARTS_STORE:
    case VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE:
    case VenueTypeCodeKey.RECORD_STORE:
    case VenueTypeCodeKey.DISTRIBUTION_STORE:
      return CLUSTER_IMAGE_COLOR_NAME.PINK
    default:
      return CLUSTER_IMAGE_COLOR_NAME.BLUE
  }
}

export const getClusterColorByDominantVenueType = (
  types: VenueTypeCode[]
): ClusterImageColorName | undefined => {
  const occurenceMap = types.reduce(
    (previous, current) => {
      const color = getClusterColorFromVenueType(current)
      if (previous[color]) {
        previous[color] += 1
      } else {
        previous[color] = 1
      }
      return previous
    },
    {} as Record<ClusterImageColorName, number>
  )

  const colorsInCluster = Object.keys(occurenceMap)
    .filter((color): color is ClusterImageColorName => !!color)
    .sort((a, b) => a.localeCompare(b))

  if (colorsInCluster.length === 0) {
    return undefined
  } else if (colorsInCluster.length === 1) {
    return colorsInCluster[0]
  }

  return colorsInCluster.join('_') as ClusterImageColorName
}
