import { VenuesModuleParameters } from 'features/home/types'
import { buildVenuesQueryOptions } from 'libs/algolia/fetchAlgolia/buildVenuesQueryOptions'
import { LocationMode } from 'libs/algolia/types'

const defaultParams: VenuesModuleParameters = {
  title: 'les cinémas de ta région',
  hitsPerPage: 10,
}

const userLocation = { latitude: 42, longitude: 43 }
const defaultBuildLocationParameterParams = {
  userLocation: undefined,
  selectedLocationMode: LocationMode.EVERYWHERE,
  aroundMeRadius: 50,
  aroundPlaceRadius: 50,
}

const defaultFacetFilters = [['has_at_least_one_bookable_offer:true'], ['is_open_to_public:true']]

describe('buildVenuesQueryOptions', () => {
  it('should fetch with default search params', () => {
    const options = buildVenuesQueryOptions(defaultParams, defaultBuildLocationParameterParams)

    expect(options).toEqual({
      facetFilters: defaultFacetFilters,
    })
  })

  it('should filter around user if geolocated and around radius provided', () => {
    const options = buildVenuesQueryOptions(defaultParams, {
      userLocation,
      selectedLocationMode: LocationMode.AROUND_ME,
      aroundMeRadius: 23,
      aroundPlaceRadius: 50,
    })

    expect(options).toEqual({
      aroundLatLng: '42, 43',
      aroundRadius: 23000,
      facetFilters: defaultFacetFilters,
    })
  })

  it('should filter with tags for playlists', () => {
    const params = { ...defaultParams, tags: ['cinema', 'canape'] }
    const options = buildVenuesQueryOptions(params, defaultBuildLocationParameterParams)

    expect(options).toEqual({
      facetFilters: [['tags:cinema', 'tags:canape'], ...defaultFacetFilters],
    })
  })

  it('should filter venue types if provided', () => {
    const params = { ...defaultParams, venueTypes: ['Librairie', 'Musique - Disquaire'] }
    const options = buildVenuesQueryOptions(params, defaultBuildLocationParameterParams)

    expect(options).toEqual({
      facetFilters: [['venue_type:BOOKSTORE', 'venue_type:RECORD_STORE'], ...defaultFacetFilters],
    })
  })
})
