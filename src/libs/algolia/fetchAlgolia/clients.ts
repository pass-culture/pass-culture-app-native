import { LegacySearchMethodProps } from 'algoliasearch'
import { SearchMethodParams, liteClient, LiteClient } from 'algoliasearch/lite'

import { env } from 'libs/environment/env'

// Lazy so the environment override can mutate `env` before credentials are captured.
let baseClient: LiteClient | undefined
const getBaseClient = (): LiteClient =>
  (baseClient ??= liteClient(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_PUBLIC_KEY))

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

const search: LiteClient['search'] = (searchMethodParams, requestOptions?) => {
  const updatedParams = updateSearchMethodParams(searchMethodParams)
  return getBaseClient().search(updatedParams, requestOptions)
}

const searchForHits: LiteClient['searchForHits'] = (searchMethodParams, requestOptions?) => {
  const updatedParams = updateSearchMethodParams(searchMethodParams)
  return getBaseClient().searchForHits(updatedParams, requestOptions)
}

export const client: LiteClient = new Proxy({} as LiteClient, {
  get(_target, property) {
    if (property === 'search') return search
    if (property === 'searchForHits') return searchForHits
    return Reflect.get(getBaseClient(), property)
  },
})
