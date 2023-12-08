import { LocationMode } from 'libs/algolia'
import { RADIUS_FILTERS } from 'libs/algolia/enums'
import {
  buildGeolocationParameter,
  computeAroundRadiusInMeters,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildGeolocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

describe('buildGeolocationParameter', () => {
  const mockedVenue: SearchQueryParameters['venue'] = {
    label: 'Venue',
    info: 'infoVenue',
    venueId: 123,
  }

  const locationFilterPlace: SearchQueryParameters['locationFilter'] = {
    locationType: LocationMode.AROUND_PLACE,
    place: {
      label: 'Place',
      info: 'infoPlace',
      geolocation: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
    },
    aroundRadius: 5,
  }

  const locationFilterAroundMe: SearchQueryParameters['locationFilter'] = {
    locationType: LocationMode.AROUND_ME,
    aroundRadius: 5,
  }

  const locationFilterEverywhere: SearchQueryParameters['locationFilter'] = {
    locationType: LocationMode.EVERYWHERE,
  }

  const userLocation: Position = {
    latitude: 48.8566,
    longitude: 2.3522,
  }

  it('should return undefined for venue location type', () => {
    const result = buildGeolocationParameter({ venue: mockedVenue, userLocation })

    expect(result).toBeUndefined()
  })

  it('should return undefined for place location type with no geolocation', () => {
    const locationFilterPlaceNoGeolocation = {
      ...locationFilterPlace,
      place: {
        ...locationFilterPlace.place,
        geolocation: null,
      },
    }
    const result = buildGeolocationParameter({
      locationFilter: locationFilterPlaceNoGeolocation,
      userLocation,
    })

    expect(result).toBeUndefined()
  })

  it('should return undefined when there is no user location', () => {
    const result = buildGeolocationParameter({
      locationFilter: locationFilterEverywhere,
      userLocation: null,
    })

    expect(result).toBeUndefined()
  })

  it('should return geolocation parameter for place location type with geolocation', () => {
    const result = buildGeolocationParameter({ locationFilter: locationFilterPlace, userLocation })

    expect(result).toEqual({
      aroundLatLng: `${locationFilterPlace?.place?.geolocation?.latitude}, ${locationFilterPlace?.place?.geolocation?.longitude}`,
      aroundRadius: locationFilterPlace.aroundRadius * 1000,
    })
  })

  it('should return undefined for online location type with around me filter', () => {
    const result = buildGeolocationParameter({
      locationFilter: locationFilterAroundMe,
      userLocation,
      isFullyDigitalOffersCategory: true,
    })

    expect(result).toBeUndefined()
  })

  it('should return geolocation parameter for around me location type', () => {
    const result = buildGeolocationParameter({
      locationFilter: locationFilterAroundMe,
      userLocation,
    })
    const expectOutput = {
      aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
      aroundRadius: (locationFilterAroundMe.aroundRadius as number) * 1000,
    }

    expect(result).toEqual(expectOutput)
  })

  it('should return geolocation parameter for "all" location type', () => {
    const result = buildGeolocationParameter({
      locationFilter: locationFilterEverywhere,
      userLocation,
    })

    expect(result).toEqual({
      aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
      aroundRadius: 'all',
    })
  })
})

describe('computeAroundRadiusInMeters', () => {
  it('should return UNLIMITED_RADIUS when locationType is EVERYWHERE', () => {
    const result = computeAroundRadiusInMeters(10, LocationMode.EVERYWHERE)

    expect(result).toEqual(RADIUS_FILTERS.UNLIMITED_RADIUS)
  })

  it('should return UNLIMITED_RADIUS when aroundRadius is null', () => {
    const result = computeAroundRadiusInMeters(null, LocationMode.AROUND_PLACE)

    expect(result).toEqual(RADIUS_FILTERS.UNLIMITED_RADIUS)
  })

  it('should return RADIUS_IN_METERS_FOR_NO_OFFERS when aroundRadius is 0', () => {
    const result = computeAroundRadiusInMeters(0, LocationMode.AROUND_PLACE)

    expect(result).toEqual(RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS)
  })

  it('should compute radius in meters for non-zero aroundRadius', () => {
    const result = computeAroundRadiusInMeters(5, LocationMode.AROUND_PLACE)

    expect(result).toEqual(5000)
  })
})
