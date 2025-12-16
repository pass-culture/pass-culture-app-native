import { SearchForHits } from 'algoliasearch/lite'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { Position } from 'libs/location/location'

type ThematicSearchQueryParams = {
  indexName: string
  userLocation?: Position
  filters?: string
  numericFilters?: string
  hitsPerPage?: number
  distinct?: boolean
  withRadius?: boolean
}

//TODO(PC-35271) - use already existing queryBuilders
export const buildQueryHelper = ({
  indexName,
  userLocation,
  filters,
  numericFilters,
  hitsPerPage,
  distinct,
  withRadius = true,
}: ThematicSearchQueryParams): SearchForHits => ({
  indexName,
  query: '',
  attributesToHighlight: [],
  attributesToRetrieve: offerAttributesToRetrieve,
  ...(userLocation
    ? {
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: withRadius ? DEFAULT_RADIUS * 1000 : 'all',
      }
    : {}),
  ...(filters && { filters }),
  ...(numericFilters && { numericFilters }),
  ...(distinct && { distinct }),
  hitsPerPage: hitsPerPage ?? 50,
})
