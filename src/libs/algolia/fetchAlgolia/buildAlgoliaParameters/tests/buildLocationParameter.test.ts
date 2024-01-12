import { LocationMode } from 'libs/algolia'
import { RADIUS_FILTERS } from 'libs/algolia/enums'
import {
  deprecatedBuildGeolocationParameter,
  deprecatedComputeAroundRadiusInMeters,
  buildLocationParameter,
} from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { SearchQueryParameters } from 'libs/algolia/types'
import { Position } from 'libs/location'

describe('buildLocationParameter', () => {
  describe('buildLocationParameter', () => {
    const userLocation: Position = {
      latitude: 48.8566,
      longitude: 2.3522,
    }

    it('should return undefined when there is no userPosition', () => {
      const result = buildLocationParameter({
        userLocation: undefined,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 50,
        aroundPlaceRadius: 50,
      })

      expect(result).toBeUndefined()
    })

    it('should return a position with a "all" rayon when selectedLocationMode is "EVERYWHERE" and there is a userPosition', () => {
      const result = buildLocationParameter({
        userLocation,
        selectedLocationMode: LocationMode.EVERYWHERE,
        aroundMeRadius: 50,
        aroundPlaceRadius: 75,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 'all',
      })
    })

    it('should return a position with a specified rayon when selectedLocationMode is "AROUND_ME" and there is a userPosition', () => {
      const result = buildLocationParameter({
        userLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: 50,
        aroundPlaceRadius: 75,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 50000,
      })
    })

    it('should return a position with a specified rayon when selectedLocationMode is "AROUND_PLACE" and there is a userPosition', () => {
      const result = buildLocationParameter({
        userLocation,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        aroundMeRadius: 50,
        aroundPlaceRadius: 75,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 75000,
      })
    })

    it('should return a position with a minimum rayon when selectedLocationMode is "AROUND_ME", the rayon is 0 and there is a userPosition', () => {
      const result = buildLocationParameter({
        userLocation,
        selectedLocationMode: LocationMode.AROUND_ME,
        aroundMeRadius: 0,
        aroundPlaceRadius: 75,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 1,
      })
    })

    it('should return a position with a minimum rayon when selectedLocationMode is "AROUND_PLACE", the rayon is 0 and there is a userPosition', () => {
      const result = buildLocationParameter({
        userLocation,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        aroundMeRadius: 50,
        aroundPlaceRadius: 0,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 1,
      })
    })
  })

  describe('deprecatedBuildGeolocationParameter', () => {
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
      const result = deprecatedBuildGeolocationParameter({ venue: mockedVenue, userLocation })

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
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterPlaceNoGeolocation,
        userLocation,
      })

      expect(result).toBeUndefined()
    })

    it('should return undefined when there is no user location', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterEverywhere,
        userLocation: null,
      })

      expect(result).toBeUndefined()
    })

    it('should return geolocation parameter for place location type with geolocation', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterPlace,
        userLocation,
      })

      expect(result).toEqual({
        aroundLatLng: `${locationFilterPlace?.place?.geolocation?.latitude}, ${locationFilterPlace?.place?.geolocation?.longitude}`,
        aroundRadius: locationFilterPlace.aroundRadius * 1000,
      })
    })

    it('should return undefined for online location type with around me filter', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterAroundMe,
        userLocation,
        isFullyDigitalOffersCategory: true,
      })

      expect(result).toBeUndefined()
    })

    it('should return geolocation parameter for around me location type', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterAroundMe,
        userLocation,
      })
      const expectOutput = {
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: (locationFilterAroundMe.aroundRadius as number) * 1000,
      }

      expect(result).toEqual(expectOutput)
    })

    it('should return geolocation parameter for everywhere location type with "all" around radius', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterEverywhere,
        userLocation,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 'all',
      })
    })

    it('should return geolocation parameter for everywhere location type with an around radius', () => {
      const result = deprecatedBuildGeolocationParameter({
        locationFilter: locationFilterEverywhere,
        userLocation,
        aroundRadius: 50000,
      })

      expect(result).toEqual({
        aroundLatLng: `${userLocation.latitude}, ${userLocation.longitude}`,
        aroundRadius: 50000,
      })
    })
  })

  describe('computeAroundRadiusInMeters', () => {
    it('should return UNLIMITED_RADIUS when locationType is EVERYWHERE', () => {
      const result = deprecatedComputeAroundRadiusInMeters(10, LocationMode.EVERYWHERE)

      expect(result).toEqual(RADIUS_FILTERS.UNLIMITED_RADIUS)
    })

    it('should return UNLIMITED_RADIUS when aroundRadius is null', () => {
      const result = deprecatedComputeAroundRadiusInMeters(null, LocationMode.AROUND_PLACE)

      expect(result).toEqual(RADIUS_FILTERS.UNLIMITED_RADIUS)
    })

    it('should return RADIUS_IN_METERS_FOR_NO_OFFERS when aroundRadius is 0', () => {
      const result = deprecatedComputeAroundRadiusInMeters(0, LocationMode.AROUND_PLACE)

      expect(result).toEqual(RADIUS_FILTERS.RADIUS_IN_METERS_FOR_NO_OFFERS)
    })

    it('should compute radius in meters for non-zero aroundRadius', () => {
      const result = deprecatedComputeAroundRadiusInMeters(5, LocationMode.AROUND_PLACE)

      expect(result).toEqual(5000)
    })
  })
})
