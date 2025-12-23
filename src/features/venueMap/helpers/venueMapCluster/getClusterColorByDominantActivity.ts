import { Activity } from 'api/gen'
import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { CLUSTER_IMAGE_COLOR_NAME } from 'features/venueMap/constant'

const getClusterColorFromActivity = (activity?: Activity): ClusterImageColorName => {
  switch (activity) {
    case Activity.ART_GALLERY:
    case Activity.CINEMA:
    case Activity.FESTIVAL:
    case Activity.GAMES_CENTRE:
    case Activity.LIBRARY:
    case Activity.MUSEUM:
    case Activity.PERFORMANCE_HALL:
      return CLUSTER_IMAGE_COLOR_NAME.ORANGE
    case Activity.BOOKSTORE:
    case Activity.CREATIVE_ARTS_STORE:
    case Activity.DISTRIBUTION_STORE:
    case Activity.MUSIC_INSTRUMENT_STORE:
    case Activity.RECORD_STORE:
      return CLUSTER_IMAGE_COLOR_NAME.PINK
    default:
      return CLUSTER_IMAGE_COLOR_NAME.BLUE
  }
}

export const getClusterColorByDominantActivity = (
  activities: Activity[]
): ClusterImageColorName | undefined => {
  const occurenceMap = activities.reduce(
    (previous, current) => {
      const color = getClusterColorFromActivity(current)
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
