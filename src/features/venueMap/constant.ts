import { Activity } from 'api/gen'
import { ClusterImageColorName } from 'features/venueMap/components/VenueMapView/types'
import { FilterGroupData } from 'features/venueMap/types'
// eslint-disable-next-line local-rules/no-theme-from-theme
import { theme } from 'theme'
import { Show } from 'ui/svg/icons/Show'
import { Sort } from 'ui/svg/icons/Sort'
import { Store } from 'ui/svg/icons/venueAndCategories/Store'
import { getSpacing } from 'ui/theme'

export const FILTER_BANNER_HEIGHT = getSpacing(12)
export const MARKER_LABEL_MARGIN_TOP = theme.designSystem.size.spacing.xs
export const MARKER_SIZE = { width: 44, height: 50 }
export const MARKER_LABEL_VISIBILITY_LIMIT = {
  altitude: 4000,
  zoom: 13,
}
export const LABEL_HEIGHT = 28

export const CLUSTER_IMAGE_COLOR_NAME = {
  BLUE: 'blue',
  ORANGE: 'orange',
  PINK: 'pink',
} satisfies Record<string, ClusterImageColorName>

export const FILTERS_ACTIVITY_MAPPING = {
  OUTINGS: [
    Activity.ART_GALLERY,
    Activity.CINEMA,
    Activity.FESTIVAL,
    Activity.GAMES_CENTRE,
    Activity.LIBRARY,
    Activity.MUSEUM,
    Activity.PERFORMANCE_HALL,
  ],
  SHOPS: [
    Activity.BOOKSTORE,
    Activity.CREATIVE_ARTS_STORE,
    Activity.DISTRIBUTION_STORE,
    Activity.MUSIC_INSTRUMENT_STORE,
    Activity.RECORD_STORE,
  ],
  OTHERS: [
    Activity.ART_SCHOOL,
    Activity.ARTS_CENTRE,
    Activity.COMMUNITY_CENTRE,
    Activity.CULTURAL_CENTRE,
    Activity.HERITAGE_SITE,
    Activity.OTHER,
    Activity.SCIENCE_CENTRE,
    Activity.TOURIST_INFORMATION_CENTRE,
    Activity.NOT_ASSIGNED,
  ],
}

export const filterGroups: FilterGroupData[] = [
  { id: 'OUTINGS', label: 'Sorties', color: theme.colors.coral, icon: Show },
  {
    id: 'SHOPS',
    label: 'Boutiques',
    color: theme.colors.primary,
    icon: Store,
  },
  { id: 'OTHERS', label: 'Autres', color: theme.colors.skyBlue, icon: Sort },
]
