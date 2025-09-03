import { buildLocationParameter } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

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

    it('should return a position with a "all" radius when selectedLocationMode is "EVERYWHERE" and there is a userPosition', () => {
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

    it('should return a position with a specified radius when selectedLocationMode is "AROUND_ME" and there is a userPosition', () => {
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

    it('should return a position with a specified radius when selectedLocationMode is "AROUND_PLACE" and there is a userPosition', () => {
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

    it('should return a position with a minimum radius when selectedLocationMode is "AROUND_ME", the radius is 0 and there is a userPosition', () => {
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

    it('should return a position with a minimum radius when selectedLocationMode is "AROUND_PLACE", the radius is 0 and there is a userPosition', () => {
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
})
