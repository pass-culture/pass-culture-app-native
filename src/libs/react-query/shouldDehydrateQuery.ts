import { Query } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

const cachedQueries = [
  QueryKeys.HOMEPAGE_MODULES,
  QueryKeys.HOME_MODULE,
  QueryKeys.HOME_VENUES_MODULE,
  QueryKeys.RECOMMENDATION_OFFER_IDS,
  QueryKeys.RECOMMENDATION_HITS,
  QueryKeys.SETTINGS,
  QueryKeys.USER_PROFILE,
  QueryKeys.BOOKINGS,
  QueryKeys.SUBCATEGORIES,
]

export const shouldDehydrateQuery = (query: Query) =>
  cachedQueries.some((queryKey) => query.queryKey.includes(queryKey))
