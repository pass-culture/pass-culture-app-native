import { LegacySearchMethodProps } from 'algoliasearch'
import { SearchMethodParams, liteClient, LiteClient } from 'algoliasearch/lite'

import { env } from 'libs/environment/env'

const baseClient = liteClient(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_PUBLIC_KEY)

export const updateSearchMethodParams = (
  searchMethodParams: SearchMethodParams | LegacySearchMethodProps
): SearchMethodParams | LegacySearchMethodProps => {
  if (Array.isArray(searchMethodParams)) {
    // Handle legacy queries coming from Algolia's React InstantSearch component
    return searchMethodParams.map((query) => {
      if (!('analytics' in (query?.params || {}))) {
        return { ...query, params: { ...query?.params, analytics: false } }
      }
      return query
    })
  }
  const { requests } = searchMethodParams
  const newRequests = requests?.map((request) => {
    if (!('analytics' in request)) {
      return { ...request, analytics: false }
    }
    return request
  })
  return { ...searchMethodParams, requests: newRequests }
}

export const client: LiteClient = {
  ...baseClient,
  search(searchMethodParams, requestOptions?) {
    const updatedParams = updateSearchMethodParams(searchMethodParams)
    return baseClient.search(updatedParams, requestOptions)
  },
  searchForHits(searchMethodParams, requestOptions?) {
    const updatedParams = updateSearchMethodParams(searchMethodParams)
    return baseClient.searchForHits(updatedParams, requestOptions)
  },
}
