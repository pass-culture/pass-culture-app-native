import { MultipleQueriesQuery } from '@algolia/client-search'

import { DEFAULT_RADIUS } from 'features/search/constants'
import { offerAttributesToRetrieve } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/offerAttributesToRetrieve'
import { Position } from 'libs/location'

type ThematicSearchQueryParams = {
  indexName: string
  userLocation?: Position
  filters?: string
  numericFilters?: string
  tagFilters?: string
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
  tagFilters = '["-is_future"]',
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
          aroundRadius: withRadius ? DEFAULT_RADIUS * 1000 : 'all',
        }
      : {}),
    ...(filters && { filters }),
    ...(numericFilters && { numericFilters }),
    ...(tagFilters && { tagFilters }),
    ...(distinct && { distinct }),
    hitsPerPage: hitsPerPage ?? 50,
  },
})
