import { VenueTypeCodeKey } from 'api/gen'
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

export const FILTERS_VENUE_TYPE_MAPPING = {
  OUTINGS: [
    VenueTypeCodeKey.CONCERT_HALL,
    VenueTypeCodeKey.FESTIVAL,
    VenueTypeCodeKey.GAMES,
    VenueTypeCodeKey.LIBRARY,
    VenueTypeCodeKey.MOVIE,
    VenueTypeCodeKey.MUSEUM,
    VenueTypeCodeKey.PERFORMING_ARTS,
    VenueTypeCodeKey.TRAVELING_CINEMA,
    VenueTypeCodeKey.VISUAL_ARTS,
  ],
  SHOPS: [
    VenueTypeCodeKey.BOOKSTORE,
    VenueTypeCodeKey.CREATIVE_ARTS_STORE,
    VenueTypeCodeKey.DISTRIBUTION_STORE,
    VenueTypeCodeKey.MUSICAL_INSTRUMENT_STORE,
    VenueTypeCodeKey.RECORD_STORE,
  ],
  OTHERS: [
    VenueTypeCodeKey.ARTISTIC_COURSE,
    VenueTypeCodeKey.CULTURAL_CENTRE,
    VenueTypeCodeKey.DIGITAL,
    VenueTypeCodeKey.OTHER,
    VenueTypeCodeKey.PATRIMONY_TOURISM,
    VenueTypeCodeKey.SCIENTIFIC_CULTURE,
  ],
}
