import { VenuesFacets } from 'libs/algolia/enums'
import { buildLocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

export const buildFetchVenuesQueryParameters = ({
  query,
  attributesToHighlight = [],
  buildLocationParameterParams,
  options,
}: FetchVenuesParameters): AlgoliaQueryParameters => {
  const defaultFilters = [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]]

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
