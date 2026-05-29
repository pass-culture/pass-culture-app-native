import { FetchSearchResultsArgs } from 'features/search/types'
import { buildOfferSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildOfferSearchParameters'
import { SearchQueryParameters } from 'libs/algolia/types'

const DEFAULT_FACET_FILTERS = JSON.stringify([['offer.isEducational:false']])
const DEFAULT_NUMERIC_FILTERS = JSON.stringify([['offer.prices: 0 TO 300']])

export const hasActiveSearchFilters = (args: FetchSearchResultsArgs): boolean => {
  const { parameters, buildLocationParameterParams, isUserUnderage, disabilitiesProperties } = args
  const isUsedFromSearch = true
  const query = buildOfferSearchParameters(
    { ...parameters },
    buildLocationParameterParams,
    isUserUnderage,
    disabilitiesProperties,
    isUsedFromSearch
  )

  const hasExtraFacetFilters = JSON.stringify(query.facetFilters) !== DEFAULT_FACET_FILTERS
  const hasExtraNumericFilters = JSON.stringify(query.numericFilters) !== DEFAULT_NUMERIC_FILTERS

  return hasExtraFacetFilters || hasExtraNumericFilters
}

const TECHNICAL_PARAM_KEYS = new Set<keyof SearchQueryParameters>([
  'page',
  'hitsPerPage',
  'searchId',
  'distinct',
  'isSortedByLikes',
  'isSortedByReleaseDate',
  'isFullyDigitalOffersCategory',
] as const satisfies ReadonlyArray<keyof SearchQueryParameters>)

type TechnicalParam = keyof typeof TECHNICAL_PARAM_KEYS

const omitTechnicalParams = (
  params: SearchQueryParameters
): Omit<SearchQueryParameters, TechnicalParam> => {
  const result = { ...params }
  TECHNICAL_PARAM_KEYS.forEach((key) => delete result[key])
  return result
}

export const getSearchQueryKey = (parameters: SearchQueryParameters) => {
  const { venue, ...rest } = omitTechnicalParams(parameters)
  return {
    ...rest,
    ...(venue ? { venueId: venue.venueId } : {}),
  }
}
