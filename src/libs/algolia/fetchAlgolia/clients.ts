import { liteClient, SearchMethodParams } from 'algoliasearch/lite'

import { env } from 'libs/environment/env'

const baseClient = liteClient(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_PUBLIC_KEY)

const disableAnalyticsByDefault = (
  searchMethodParams: Parameters<typeof baseClient.search>[0]
): SearchMethodParams => {
  const params = Array.isArray(searchMethodParams)
    ? searchMethodParams
    : searchMethodParams.requests
  const requests = params.map((req) => ({ analytics: false as const, ...req }))
  const normalized = Array.isArray(searchMethodParams)
    ? { requests }
    : { ...searchMethodParams, requests }
  return normalized
}

export const client: typeof baseClient = {
  ...baseClient,
  search(searchMethodParams, requestOptions) {
    return baseClient.search(disableAnalyticsByDefault(searchMethodParams), requestOptions)
  },
  searchForHits(searchMethodParams, requestOptions) {
    return baseClient.searchForHits(disableAnalyticsByDefault(searchMethodParams), requestOptions)
  },
}
