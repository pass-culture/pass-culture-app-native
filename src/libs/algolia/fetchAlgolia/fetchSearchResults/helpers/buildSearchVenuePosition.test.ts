import { MAX_RADIUS } from 'features/search/helpers/reducer.helpers'
import { BuildLocationParameterParams } from 'libs/algolia/fetchAlgolia/buildAlgoliaParameters/buildLocationParameter'
import {
  buildSearchVenuePosition,
  convertKmToMeters,
} from 'libs/algolia/fetchAlgolia/fetchSearchResults/helpers/buildSearchVenuePosition'
import { LocationMode } from 'libs/algolia/types'
import { Position } from 'libs/location/location'
import { SuggestedPlace } from 'libs/place/types'
import { mockedSuggestedVenue } from 'libs/venue/fixtures/mockedSuggestedVenues'

const Kourou: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'locality',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}
const venue = mockedSuggestedVenue

const geolocPosition: Position = { latitude: 66, longitude: 66 }
const buildLocationParameterParamsAroundMe: BuildLocationParameterParams = {
  selectedLocationMode: LocationMode.AROUND_ME,
  userLocation: geolocPosition,
  aroundMeRadius: MAX_RADIUS,
  aroundPlaceRadius: 'all',
}

const buildLocationParameterParamsEverywhere: BuildLocationParameterParams = {
  selectedLocationMode: LocationMode.EVERYWHERE,
  userLocation: null,
  aroundMeRadius: MAX_RADIUS,
  aroundPlaceRadius: MAX_RADIUS,
}

const buildLocationParameterParamsAroundPlace: BuildLocationParameterParams = {
  selectedLocationMode: LocationMode.AROUND_PLACE,
  userLocation: Kourou.geolocation,
  aroundMeRadius: 'all',
  aroundPlaceRadius: MAX_RADIUS,
}

describe('buildSearchVenuePosition', () => {
  describe('When user shares his position', () => {
    it('should return user position and around radius when location filter is around me', () => {
      const searchVenuePosition = buildSearchVenuePosition(buildLocationParameterParamsAroundMe)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return user position and around radius at "all" when location filter is everywhere', () => {
      const searchVenuePosition = buildSearchVenuePosition({
        ...buildLocationParameterParamsEverywhere,
        userLocation: geolocPosition,
      })

      expect(searchVenuePosition).toEqual({
        aroundLatLng: `${geolocPosition.latitude}, ${geolocPosition.longitude}`,
        aroundRadius: 'all',
      })
    })

    it('should return venue position and around radius when location filter is venue', () => {
      const searchVenuePosition = buildSearchVenuePosition(
        {
          ...buildLocationParameterParamsEverywhere,
          userLocation: geolocPosition,
        },
        venue
      )

      expect(searchVenuePosition).toEqual({
        aroundLatLng: '5.16186, -52.669736',
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return place position and around radius when location filter is place', () => {
      const searchVenuePosition = buildSearchVenuePosition(buildLocationParameterParamsAroundPlace)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: '5.16186, -52.669736',
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })
  })

  describe('When user does not share his position', () => {
    it('should return around radius at "all" when location filter is around me', () => {
      const searchVenuePosition = buildSearchVenuePosition({
        ...buildLocationParameterParamsAroundMe,
        userLocation: null,
      })

      expect(searchVenuePosition).toEqual({
        aroundRadius: 'all',
      })
    })

    it('should return around radius at "all" when location filter is everywhere', () => {
      const searchVenuePosition = buildSearchVenuePosition(buildLocationParameterParamsEverywhere)

      expect(searchVenuePosition).toEqual({
        aroundRadius: 'all',
      })
    })

    it('should return venue position and around radius when location filter is venue', () => {
      const searchVenuePosition = buildSearchVenuePosition(
        buildLocationParameterParamsEverywhere,
        venue
      )

      expect(searchVenuePosition).toEqual({
        aroundLatLng: '5.16186, -52.669736',
        aroundRadius: convertKmToMeters(MAX_RADIUS),
      })
    })

    it('should return place position and around radius when location filter is place', () => {
      const searchVenuePosition = buildSearchVenuePosition(buildLocationParameterParamsAroundPlace)

      expect(searchVenuePosition).toEqual({
        aroundLatLng: '5.16186, -52.669736',
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
