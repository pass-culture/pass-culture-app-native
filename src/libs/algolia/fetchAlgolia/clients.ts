import algoliasearch from 'algoliasearch'

import { env } from 'libs/environment/env'

export const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_PUBLIC_KEY)
