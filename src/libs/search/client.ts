import * as ElasticAppSearch from '@elastic/app-search-javascript'

import { env } from 'libs/environment'

export const client = ElasticAppSearch.createClient({
  searchKey: env.APP_SEARCH_KEY,
  endpointBase: env.APP_SEARCH_ENDPOINT,
  engineName: env.APP_SEARCH_ENGINE,
})
