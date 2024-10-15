import { VenueTypeCodeKey } from 'api/gen'
import { CLUSTER_IMAGE_COLOR_NAME } from 'features/venueMap/components/VenueMapView/constant'
import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
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
    case VenueTypeCodeKey.CULTURAL_CENTRE:
    case VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE:
    case VenueTypeCodeKey.RECORD_STORE:
      return CLUSTER_IMAGE_COLOR_NAME.PINK
    default:
      return CLUSTER_IMAGE_COLOR_NAME.BLUE
  }
}

const clusterColorPriorityMap: Record<ClusterImageColorName, number> = {
  [CLUSTER_IMAGE_COLOR_NAME.PINK]: 1,
  [CLUSTER_IMAGE_COLOR_NAME.BLUE]: 2,
  [CLUSTER_IMAGE_COLOR_NAME.ORANGE]: 3,
}

export const getClusterColorByDominantVenueType = (types: VenueTypeCode[]) => {
  const occurenceMap = types.reduce<Record<ClusterImageColorName, number> | Record<string, never>>(
    (previous, current) => {
      const color = getClusterColorFromVenueType(current)
      if (previous[color]) {
        previous[color] += 1
      } else {
        previous[color] = 1
      }
      return previous
    },
    {}
  )

  const sortedColors = Object.entries(occurenceMap)
    .filter(
      (entry): entry is [ClusterImageColorName, number] =>
        entry.at(0) !== undefined && entry.at(1) !== undefined
    )
    .sort((a, b) => {
      const [previousColorName, previousColorCount] = a
      const [nextColorName, nextColorCount] = b

      if (previousColorCount !== nextColorCount) {
        return nextColorCount - previousColorCount
      }
      if (clusterColorPriorityMap[previousColorName] && clusterColorPriorityMap[nextColorName]) {
        return clusterColorPriorityMap[nextColorName] > clusterColorPriorityMap[previousColorName]
          ? -1
          : 1
      }
      return 0
    })

  return sortedColors[0]?.[0] as ClusterImageColorName
}
