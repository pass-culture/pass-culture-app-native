import { SearchOptions } from '@elastic/app-search-javascript'

import { VenuesSearchParametersFields } from 'features/home/contentful'
import { LocationType } from 'features/search/enums'
import { GeoCoordinates } from 'libs/geolocation'
import { buildBoostsVenues } from 'libs/search/filters/buildBoosts'
import { parseGeolocationParameters } from 'libs/search/parseSearchParameters'
import { getVenueTypeFacetFilters } from 'libs/search/utils/getVenueTypeFacetFilters'

import { buildVenuesFacetFilters } from './buildFacetFilters'
import { buildVenuesGeolocationFilter } from './buildGeolocationFilter'
import { AppSearchVenuesFields, VENUES_RESULT_FIELDS } from './constants'

export const buildVenuesQueryOptions = (
  params: VenuesSearchParametersFields,
  userLocation: GeoCoordinates | null
): SearchOptions<AppSearchVenuesFields> => {
  const { aroundRadius, isGeolocated, venueTypes = [], hitsPerPage } = params

  const locationFilter = parseGeolocationParameters(userLocation, isGeolocated, aroundRadius) || {
    locationType: LocationType.EVERYWHERE,
  }

  const queryOptions: SearchOptions<AppSearchVenuesFields> = {
    result_fields: VENUES_RESULT_FIELDS,
    filters: {
      all: [
        ...buildVenuesFacetFilters(venueTypes.map(getVenueTypeFacetFilters)),
        ...buildVenuesGeolocationFilter(locationFilter, userLocation),
      ],
    },
    page: {
      current: 1, // no pagination for engine venues
      size: hitsPerPage || 20,
    },
    group: { field: AppSearchVenuesFields.id },
  }

  const boosts = buildBoostsVenues(userLocation)
  if (boosts) {
    queryOptions['boosts'] = boosts
  }

  return queryOptions
}
