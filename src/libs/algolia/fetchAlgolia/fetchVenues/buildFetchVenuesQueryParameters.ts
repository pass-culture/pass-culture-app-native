import { AlgoliaQueryParameters, FetchVenuesParameters } from 'libs/algolia/types'

export const buildFetchVenuesQueryParameters = ({
  query,
  attributesToHighlight = [],
}: FetchVenuesParameters): AlgoliaQueryParameters => ({
  query: query || '',
  requestOptions: { attributesToHighlight }, // By default We disable highlighting because we don't need it
})
