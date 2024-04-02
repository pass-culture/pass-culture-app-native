import { Geoloc } from 'libs/algolia/types'

export const isGeolocValid = (geoloc: Geoloc | undefined): boolean =>
  // Integer values are suspicious, we avoid them so that we don't display venues with wrong geoloc
  !!(geoloc?.lat && geoloc?.lng && !Number.isInteger(geoloc.lat) && !Number.isInteger(geoloc.lng))
