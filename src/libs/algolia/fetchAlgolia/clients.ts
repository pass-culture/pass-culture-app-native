import { liteClient } from 'algoliasearch/lite'

import { env } from 'libs/environment/env'

export const client = liteClient(env.ALGOLIA_APPLICATION_ID, env.ALGOLIA_SEARCH_API_PUBLIC_KEY)
