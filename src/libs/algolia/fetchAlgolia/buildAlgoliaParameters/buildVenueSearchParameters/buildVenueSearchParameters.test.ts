import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { buildVenueSearchParameters } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildVenueSearchParameters/buildVenueSearchParameters'
import { LocationMode } from 'libs/location/types'

const userLocation = {
  latitude: 48.8566,
  longitude: 2.3522,
}
const buildLocationParameterParams: BuildLocationParameterParams = {
  userLocation,
  selectedLocationMode: LocationMode.AROUND_ME,
  aroundMeRadius: 'all',
  aroundPlaceRadius: 'all',
}
const disabilitiesProperties = {
  isAudioDisabilityCompliant: false,
  isMentalDisabilityCompliant: true,
  isMotorDisabilityCompliant: true,
  isVisualDisabilityCompliant: false,
}

const defaultFacetFilters = [['is_open_to_public:false']]

describe('buildVenueSearchParameters', () => {
  it("shouldn't return a facetFilter if no disabilitiesProperties is given", () => {
    const venueSearchPredicate = buildVenueSearchParameters(buildLocationParameterParams)

    expect(venueSearchPredicate).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: defaultFacetFilters,
    })
  })

  it('should return the full predicate if disabilityProperties are given', () => {
    const venueSearchPredicate = buildVenueSearchParameters(
      buildLocationParameterParams,
      disabilitiesProperties
    )

    expect(venueSearchPredicate).toEqual({
      aroundLatLng: '48.8566, 2.3522',
      aroundRadius: 'all',
      facetFilters: [...defaultFacetFilters, ['mental_disability:true'], ['motor_disability:true']],
    })
  })
})
