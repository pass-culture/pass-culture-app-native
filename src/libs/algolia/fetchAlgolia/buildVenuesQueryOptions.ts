import { VenuesModuleParameters } from 'features/home/types'
import { LocationType } from 'features/search/enums'
import { FiltersArray } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import { buildGeolocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'
import { adaptGeolocationParameters } from 'libs/algolia/fetchAlgolia/helpers/adaptGeolocationParameters'
import { Position } from 'libs/location'

export const buildVenuesQueryOptions = (params: VenuesModuleParameters, userLocation: Position) => {
  const { aroundRadius, isGeolocated, tags = [], venueTypes = [] } = params

  const locationFilter = adaptGeolocationParameters(userLocation, isGeolocated, aroundRadius) ?? {
    locationType: LocationType.EVERYWHERE,
  }

  const facetFilters: FiltersArray = []

  if (tags.length) {
    const tagsPredicate = buildTagsPredicate(tags)
    facetFilters.push(tagsPredicate)
  }

  if (venueTypes.length) {
    const venueTypesPredicate = buildVenueTypesPredicate(venueTypes.map(getVenueTypeFacetFilters))
    facetFilters.push(venueTypesPredicate)
  }

  // We want to show on home page only venues that have at least one offer that is searchable in algolia
  const hasAtLeastOneBookableOfferPredicate = [
    `${VenuesFacets.has_at_least_one_bookable_offer}:true`,
  ]
  facetFilters.push(hasAtLeastOneBookableOfferPredicate)

  return {
    ...buildGeolocationParameter({ locationFilter, userLocation }),
    ...(facetFilters.length > 0 ? { facetFilters } : {}),
  }
}

const buildVenueTypesPredicate = (venueTypes: string[]): string[] =>
  venueTypes.map((venueType) => `${VenuesFacets.venue_type}:${venueType}`)

const buildTagsPredicate = (tags: string[]): string[] =>
  tags.map((tag: string) => `${VenuesFacets.tags}:${tag}`)
