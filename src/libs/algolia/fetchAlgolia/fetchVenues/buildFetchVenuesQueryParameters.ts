import { VenuesFacets } from 'libs/algolia/enums'
import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

export const buildFetchVenuesQueryParameters = ({
  query,
  attributesToHighlight = [],
}: FetchVenuesParameters): AlgoliaQueryParameters => ({
  query: query || '',
  requestOptions: {
    attributesToHighlight,
    facetFilters: [[`${VenuesFacets.has_at_least_one_bookable_offer}:true`]],
  }, // By default We disable highlighting because we don't need it
})
