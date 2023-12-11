import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'

describe('buildVenuesQueryOptions', () => {
  it('should fetch with default search params', () => {
    const options = buildVenuesQueryOptions({ locationFilter: undefined })

    expect(options).toEqual({
      facetFilters: [['has_at_least_one_bookable_offer:true']],
    })
  })

  it('should filter with tags for playlists', () => {
    const params = { tags: ['cinema', 'canape'], locationFilter: undefined }
    const options = buildVenuesQueryOptions(params) //userLocation null

    expect(options).toEqual({
      facetFilters: [['tags:cinema', 'tags:canape'], ['has_at_least_one_bookable_offer:true']],
    })
  })

  it('should filter venue types if provided', () => {
    const params = { venueTypes: ['Librairie', 'Musique - Disquaire'], locationFilter: undefined }
    const options = buildVenuesQueryOptions(params) //userLocation null

    expect(options).toEqual({
      facetFilters: [
        ['venue_type:BOOKSTORE', 'venue_type:RECORD_STORE'],
        ['has_at_least_one_bookable_offer:true'],
      ],
    })
  })
})
