import { AlgoliaVenue } from 'libs/algolia/types'

export const removeGeolocFromVenue = (venue: AlgoliaVenue) => ({
  ...venue,
  _geoloc: {
    lat: null,
    lng: null,
  },
})
