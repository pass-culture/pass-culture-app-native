import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { env } from 'libs/environment/env'

type buildVenueNotOpenToPublicArgs = {
  query: string
}

export const buildVenueNotOpenToPublicQuery = ({ query }: buildVenueNotOpenToPublicArgs) => ({
  indexName: env.ALGOLIA_VENUES_INDEX_EXPERIMENTAL,
  query,
  facetFilters: [[`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:false`]],
  page: 0,
  hitsPerPage: query ? 1 : 0,
  clickAnalytics: true,
})
