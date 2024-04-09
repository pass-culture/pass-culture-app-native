import algoliasearch from 'algoliasearch'

import { env } from 'libs/environment'

export const client = algoliasearch(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_PUBLIC_API_KEY)
