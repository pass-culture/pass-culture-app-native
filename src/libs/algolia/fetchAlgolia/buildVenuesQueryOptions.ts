import { VenuesModuleParameters } from 'features/home/types'
import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import {
  buildLocationParameter,
  BuildLocationParameterParams,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { getActivityFacetFilters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/getActivityFacetFilters'
import { FiltersArray } from 'libs/algolia/types'

export const buildVenuesQueryOptions = (
  params: VenuesModuleParameters,
  buildLocationParameterParams: BuildLocationParameterParams
) => {
  const { tags = [], activities = [] } = params

  const facetFilters: FiltersArray = []

  if (tags.length) {
    const tagsPredicate = buildTagsPredicate(tags)
    facetFilters.push(tagsPredicate)
  }

  if (activities.length) {
    const activitiesPredicate = buildActivitiesPredicate(activities.map(getActivityFacetFilters))
    facetFilters.push(activitiesPredicate)
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

const buildActivitiesPredicate = (activities: string[]): string[] =>
  activities.map((activity) => `${VENUES_FACETS_ENUM.ACTIVITY}:${activity}`)

const buildTagsPredicate = (tags: string[]): string[] =>
  tags.map((tag: string) => `${VENUES_FACETS_ENUM.TAGS}:${tag}`)
