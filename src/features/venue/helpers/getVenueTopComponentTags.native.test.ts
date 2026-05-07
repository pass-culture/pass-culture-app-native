import { VenueResponse } from 'api/gen'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { getVenueTopComponentTags } from 'features/venue/helpers/getVenueTopComponentTags'
import { LocationMode } from 'libs/location/types'

describe('getVenueTopComponentTags', () => {
  describe('When venue is open to public', () => {
    it('should return activity and distance when defined', () => {
      const userLocation = { latitude: 30, longitude: 30.1 }
      const locatedVenue: VenueResponse = {
        ...venueDataTest,
        latitude: 30,
        longitude: 30,
        isOpenToPublic: true,
      }
      const tags = getVenueTopComponentTags(
        locatedVenue,
        userLocation,
        null,
        LocationMode.AROUND_ME
      )

      expect(tags).toEqual(['Librairie', 'À 10 km'])
    })

    it('should return only activity when distance not defined', () => {
      const tags = getVenueTopComponentTags(
        {
          ...venueDataTest,
          isOpenToPublic: true,
        },
        undefined,
        null,
        LocationMode.EVERYWHERE
      )

      expect(tags).toEqual(['Librairie'])
    })

    it('should return only distance when activity not defined', () => {
      const userLocation = { latitude: 30, longitude: 30.1 }
      const locatedVenue: VenueResponse = {
        ...venueDataTest,
        latitude: 30,
        longitude: 30,
        isOpenToPublic: true,
        activity: null,
      }
      const tags = getVenueTopComponentTags(
        locatedVenue,
        userLocation,
        null,
        LocationMode.AROUND_ME
      )

      expect(tags).toEqual(['À 10 km'])
    })

    it('should return empty array when activity and distance not defined', () => {
      const tags = getVenueTopComponentTags(
        {
          ...venueDataTest,
          isOpenToPublic: true,
          activity: null,
        },
        undefined,
        null,
        LocationMode.EVERYWHERE
      )

      expect(tags).toEqual([])
    })
  })

  describe('When venue is not open to public', () => {
    it('should return cultural domains when defined', () => {
      const tags = getVenueTopComponentTags(
        {
          ...venueDataTest,
          isOpenToPublic: false,
          culturalDomains: [
            { id: 1, name: 'Architecture' },
            { id: 2, name: 'Arts numériques' },
          ],
        },
        undefined,
        null,
        LocationMode.EVERYWHERE
      )

      expect(tags).toEqual(['Architecture', 'Arts numériques'])
    })

    it('should return empty array when cultural domains not defined', () => {
      const tags = getVenueTopComponentTags(
        {
          ...venueDataTest,
          isOpenToPublic: false,
        },
        undefined,
        null,
        LocationMode.EVERYWHERE
      )

      expect(tags).toEqual([])
    })
  })
})
