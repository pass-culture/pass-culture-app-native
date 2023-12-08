import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { LocationFilter } from 'features/search/types'
import { Venue } from 'features/venue/types'
import { LocationMode } from 'libs/algolia'
import {
  buildSearchVenuePosition,
  convertKmToMeters,
} from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { Position } from 'libs/location'
import { SuggestedPlace } from 'libs/place'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue: Venue = mockedSuggestedVenues[0]

const geolocPosition: Position = { latitude: 66, longitude: 66 }
const aroundMeFilter: LocationFilter = {
  locationType: LocationMode.AROUND_ME,
  aroundRadius: MAX_RADIUS,
}
const everywhereFilter: LocationFilter = { locationType: LocationMode.EVERYWHERE }
const placeFilter: LocationFilter = {
  locationType: LocationMode.AROUND_PLACE,
  place: Kourou,
  aroundRadius: MAX_RADIUS,
}

describe('buildSearchVenuePosition', () => {
  describe('When user shares his position', () => {
    it('should return user position and around radius when location filter is around me', () => {
      const searchVenuePosition = buildSearchVenuePosition(aroundMeFilter, geolocPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return user position and around radius at "all" when location filter is everywhere', () => {
      const searchVenuePosition = buildSearchVenuePosition(everywhereFilter, geolocPosition)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: 'all',
      })
    })

    it('should return venue position and around radius when location filter is venue', () => {
      const searchVenuePosition = buildSearchVenuePosition(everywhereFilter, geolocPosition, venue)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${venue?._geoloc?.lat}, ${venue?._geoloc?.lng}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return place position and around radius when location filter is place', () => {
      const searchVenuePosition = buildSearchVenuePosition(placeFilter, geolocPosition)

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
        geolocPosition
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
      const searchVenuePosition = buildSearchVenuePosition(everywhereFilter, undefined, venue)

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
