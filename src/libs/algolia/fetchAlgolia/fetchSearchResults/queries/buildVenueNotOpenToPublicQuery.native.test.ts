import { VENUES_FACETS_ENUM } from 'libs/algolia/enums/facetsEnums'
import { env } from 'libs/environment/env'

import { buildVenueNotOpenToPublicQuery } from './buildVenueNotOpenToPublicQuery'

describe('buildVenueNotOpenToPublicQuery', () => {
  it('should return 1 hit if a query is provided', () => {
    const query = buildVenueNotOpenToPublicQuery({ query: 'Lieu' })

    expect(query).toMatchObject({
      indexName: env.ALGOLIA_VENUES_INDEX_EXPERIMENTAL,
      query: 'Lieu',
      hitsPerPage: 1,
      facetFilters: [[`${VENUES_FACETS_ENUM.VENUE_IS_OPEN_TO_PUBLIC}:false`]],
    })
  })

  it('should return 0 hits if query is empty', () => {
    const query = buildVenueNotOpenToPublicQuery({ query: '' })

    expect(query.hitsPerPage).toBe(0)
  })
})
