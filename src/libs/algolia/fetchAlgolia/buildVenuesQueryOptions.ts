import { VenuesModuleParameters } from 'features/home/types'
import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import {
  buildLocationParameter,
  BuildLocationParameterParams,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { getVenueTypeFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getVenueTypeFacetFilters'
import { FiltersArray } from 'libs/algolia/types'

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
    `${VENUES_FACETS_ENUM.HAS_AT_LEAST_ONE_BOOKABLE_OFFER}:true`,
  ]
  const isOpenToPublicPredicate = [`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:true`]
  facetFilters.push(hasAtLeastOneBookableOfferPredicate, isOpenToPublicPredicate)

  return {
    ...buildLocationParameter(buildLocationParameterParams),
    ...(facetFilters.length > 0 ? { facetFilters } : {}),
  }
}

const buildVenueTypesPredicate = (venueTypes: string[]): string[] =>
  venueTypes.map((venueType) => `${VENUES_FACETS_ENUM.VENUE_TYPE}:${venueType}`)

const buildTagsPredicate = (tags: string[]): string[] =>
  tags.map((tag: string) => `${VENUES_FACETS_ENUM.TAGS}:${tag}`)
