import { LocationType } from 'features/search/enums'
import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { Venue } from 'features/venue/types'
import {
  buildSearchVenuePosition,
  convertKmToMeters,
} from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { Position } from 'libs/geolocation'
import { SuggestedPlace } from 'libs/place'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: Venue = mockedSuggestedVenues[0]

const userPosition: Position = { latitude: 66, longitude: 66 }
const aroundMeFilter: LocationFilter = {
  locationType: LocationType.AROUND_ME,
  aroundRadius: MAX_RADIUS,
}
const everywhereFilter: LocationFilter = { locationType: LocationType.EVERYWHERE }
const placeFilter: LocationFilter = {
  locationType: LocationType.PLACE,
  place: Kourou,
  aroundRadius: MAX_RADIUS,
}
const venueFilter: LocationFilter = {
  locationType: LocationType.VENUE,
  venue,
}

describe('buildSearchVenuePosition', () => {
  describe('When user shares his position', () => {
    it('should return user position and around radius when location filter is around me', () => {
      const searchVenuePosition = buildSearchVenuePosition(aroundMeFilter, userPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${userPosition.latitude}, ${userPosition.longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return user position and around radius at "all" when location filter is everywhere', () => {
      const searchVenuePosition = buildSearchVenuePosition(everywhereFilter, userPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${userPosition.latitude}, ${userPosition.longitude}`,
        aroundRadius: 'all',
      })
    })

    it('should return venue position and around radius when location filter is venue', () => {
      const searchVenuePosition = buildSearchVenuePosition(venueFilter, userPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${venue?._geoloc?.lat}, ${venue?._geoloc?.lng}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return place position and around radius when location filter is place', () => {
      const searchVenuePosition = buildSearchVenuePosition(placeFilter, userPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${Kourou?.geolocation?.latitude}, ${Kourou?.geolocation?.longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should set "aroundRadius" to "all" when not provided', () => {
      const aroundMeWithoutAroundRadius = {
        ...aroundMeFilter,
        aroundRadius: null,
      }
      const searchVenuePosition = buildSearchVenuePosition(
        aroundMeWithoutAroundRadius,
        userPosition
      )

      expect(searchVenuePosition.aroundRadius).toEqual('all')
    })
  })

  describe('When user does not share his position', () => {
    it('should return around radius at "all" when location filter is around me', () => {
      const searchVenuePosition = buildSearchVenuePosition(aroundMeFilter)

      expect(searchVenuePosition).toEqual({
        aroundRadius: 'all',
      })
    })

    it('should return around radius at "all" when location filter is everywhere', () => {
      const searchVenuePosition = buildSearchVenuePosition(everywhereFilter)

      expect(searchVenuePosition).toEqual({
        aroundRadius: 'all',
      })
    })

    it('should return venue position and around radius when location filter is venue', () => {
      const searchVenuePosition = buildSearchVenuePosition(venueFilter)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${venue?._geoloc?.lat}, ${venue?._geoloc?.lng}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return place position and around radius when location filter is place', () => {
      const searchVenuePosition = buildSearchVenuePosition(placeFilter)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${Kourou?.geolocation?.latitude}, ${Kourou?.geolocation?.longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })
  })
})

describe('convertKmToMeters', () => {
  it('should convert kilometers to meters', () => {
    expect(convertKmToMeters(5)).toEqual(5000)
    expect(convertKmToMeters(10)).toEqual(10000)
  })

  it('should return "all" when input is "all"', () => {
    expect(convertKmToMeters('all')).toEqual('all')
  })
})
