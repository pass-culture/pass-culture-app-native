import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { buildLocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

export const buildFetchVenuesQueryParameters = ({
  query,
  attributesToHighlight = [],
  buildLocationParameterParams,
  options,
}: FetchVenuesParameters): AlgoliaQueryParameters => {
  const defaultFilters = [
    [`${VENUES_FACETS_ENUM.HAS_AT_LEAST_ONE_BOOKABLE_OFFER}:true`],
    [`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:true`],
  ]

  const facetFilters = options?.facetFilters
    ? [...defaultFilters, ...options.facetFilters]
    : defaultFilters

  return {
    query: query || '',
    requestOptions: {
      ...options,
      attributesToHighlight,
      facetFilters,
      ...buildLocationParameter(buildLocationParameterParams),
    }, // By default We disable highlighting because we don't need it
  }
}
