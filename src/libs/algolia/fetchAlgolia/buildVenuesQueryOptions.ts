import { VenuesModuleParameters } from 'features/home/types'
import { FiltersArray } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import {
  buildLocationParameter,
  BuildLocationParameterParams,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'

export const buildVenuesQueryOptions = (
  params: VenuesModuleParameters,
  buildLocationParameterParams: BuildLocationParameterParams
) => {
  const { tags = [], venueTypes = [] } = params

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
    ...buildLocationParameter(buildLocationParameterParams),
    ...(facetFilters.length > 0 ? { facetFilters } : {}),
  }
}

const buildVenueTypesPredicate = (venueTypes: string[]): string[] =>
  venueTypes.map((venueType) => `${VenuesFacets.venue_type}:${venueType}`)

const buildTagsPredicate = (tags: string[]): string[] =>
  tags.map((tag: string) => `${VenuesFacets.tags}:${tag}`)
