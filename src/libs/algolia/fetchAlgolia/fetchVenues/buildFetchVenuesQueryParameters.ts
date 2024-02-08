import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia'
import { VenuesFacets } from 'libs/algolia/enums'
import { buildLocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'

export const buildFetchVenuesQueryParameters = ({
  query,
  attributesToHighlight = [],
  buildLocationParameterParams,
}: FetchVenuesParameters): AlgoliaQueryParameters => ({
  query: query || '',
  requestOptions: {
    attributesToHighlight,
    facetFilters: [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]],
    ...buildLocationParameter(buildLocationParameterParams),
  }, // By default We disable highlighting because we don't need it
})
