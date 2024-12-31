import { MultipleQueriesQuery } from '@algolia/client-search'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { Position } from 'libs/location'

type ThematicSearchQueryParams = {
  indexName: string
  userLocation?: Position
  filters?: string
  numericFilters?: string
  hitsPerPage?: number
  distinct?: boolean
  withRadius?: boolean
}

export const buildQuery = ({
  indexName,
  userLocation,
  filters,
  numericFilters,
  hitsPerPage,
  distinct,
  withRadius = true,
}: ThematicSearchQueryParams): MultipleQueriesQuery => ({
  indexName,
  query: '',
  params: {
    attributesToHighlight: [],
    attributesToRetrieve: offerAttributesToRetrieve,
    ...(userLocation
      ? {
          aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
          ...(withRadius && { aroundRadius: DEFAULT_RADIUS * 1000 }),
        }
      : {}),
    ...(filters && { filters }),
    ...(numericFilters && { numericFilters }),
    ...(distinct && { distinct }),
    hitsPerPage: hitsPerPage ?? 50,
  },
})
