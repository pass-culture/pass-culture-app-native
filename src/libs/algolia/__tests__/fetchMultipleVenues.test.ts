import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/fetchMultipleVenues'
import { VenuesSearchParametersFields } from 'libs/contentful'

const defaultParams: VenuesSearchParametersFields = {
  title: 'les cinémas de ta région',
  hitsPerPage: 10,
}
const userLocation = { latitude: 42, longitude: 43 }

describe('buildVenuesQueryOptions', () => {
  it('should fetch with default search params', () => {
    const options = buildVenuesQueryOptions(defaultParams, null)
    expect(options).toEqual({
      facetFilters: [['has_at_least_one_bookable_offer:true']],
    })
  })

  it('should filter around user if geolocated and around radius provided', () => {
    const params = { ...defaultParams, isGeolocated: true, aroundRadius: 23 }
    const options = buildVenuesQueryOptions(params, userLocation)
    expect(options).toEqual({
      aroundLatLng: '42, 43',
      aroundRadius: 23000,
      facetFilters: [['has_at_least_one_bookable_offer:true']],
    })
  })

  it('should filter with tags for playlists', () => {
    const params = { ...defaultParams, tags: ['cinema', 'canape'] }
    const options = buildVenuesQueryOptions(params, null)
    expect(options).toEqual({
      facetFilters: [['tags:cinema', 'tags:canape'], ['has_at_least_one_bookable_offer:true']],
    })
  })

  it('should filter venue types if provided', () => {
    const params = { ...defaultParams, venueTypes: ['Librairie', 'Musique - Disquaire'] }
    const options = buildVenuesQueryOptions(params, null)
    expect(options).toEqual({
      facetFilters: [
        ['venue_type:BOOKSTORE', 'venue_type:RECORD_STORE'],
        ['has_at_least_one_bookable_offer:true'],
      ],
    })
  })
})
