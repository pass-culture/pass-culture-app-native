import * as ElasticAppSearch from '@elastic/app-search-javascript'

import { env } from 'libs/environment'

const OFFERS_ENGINE_NAME = 'offers'

export const client = ElasticAppSearch.createClient({
  searchKey: env.APP_SEARCH_KEY,
  endpointBase: env.APP_SEARCH_ENDPOINT,
  engineName: OFFERS_ENGINE_NAME,
})
