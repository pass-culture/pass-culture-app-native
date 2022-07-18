import AlgoliaSearchInsights from 'search-insights'
import { v1 as uuid } from 'uuid'

import { env } from 'libs/environment'

export const initAlgoliaAnalytics = () => {
  AlgoliaSearchInsights('init', {
    appId: env.ALGOLIA_APPLICATION_ID,
    apiKey: env.ALGOLIA_SEARCH_API_KEY,
  })

  AlgoliaSearchInsights('setUserToken', uuid())
}
