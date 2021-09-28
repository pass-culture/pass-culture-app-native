import * as ElasticAppSearch from '@elastic/app-search-javascript'

import { env } from 'libs/environment'

const OFFERS_ENGINE_NAME = 'offers-meta'
const VENUES_ENGINE_NAME = 'venues'

export const offersClient = ElasticAppSearch.createClient({
  searchKey: env.APP_SEARCH_KEY,
  endpointBase: env.APP_SEARCH_ENDPOINT,
  engineName: OFFERS_ENGINE_NAME,
})

export const venuesClient = ElasticAppSearch.createClient({
  searchKey: env.APP_SEARCH_KEY,
  endpointBase: env.APP_SEARCH_ENDPOINT,
  engineName: VENUES_ENGINE_NAME,
})
