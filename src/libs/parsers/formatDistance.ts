import { Geoloc } from 'libs/algolia'
import { Position } from 'libs/geolocation'

const EARTH_RADIUS_KM = 6378.137

export const getHumanizeRelativeDistance = (
  userLocation: Geoloc,
  venueLocation: Geoloc
): string | undefined => {
  const { lat: userLat, lng: userLng } = userLocation
  const { lat: venueLat, lng: venueLng } = venueLocation

  if (!userLat || !userLng || !venueLat || !venueLng) return

  const distanceInMeters = computeDistanceInMeters(venueLat, venueLng, userLat, userLng)
  return humanizeDistance(distanceInMeters).replace('.', ',')
}

export const computeDistanceInMeters = (latA: number, lngA: number, latB: number, lngB: number) => {
  const newLat = (latB * Math.PI) / 180 - (latA * Math.PI) / 180
  const newLng = (lngB * Math.PI) / 180 - (lngA * Math.PI) / 180
  const a =
    Math.sin(newLat / 2) * Math.sin(newLat / 2) +
    Math.cos((latA * Math.PI) / 180) *
      Math.cos((latB * Math.PI) / 180) *
      Math.sin(newLng / 2) *
      Math.sin(newLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return EARTH_RADIUS_KM * c * 1000
}

export const humanizeDistance = (distance: number) => {
  if (distance < 30) return `${Math.round(distance)} m`
  if (distance < 100) return `${Math.round(distance / 5) * 5} m`
  if (distance < 1000) return `${Math.round(distance / 10) * 10} m`
  if (distance < 5000) return `${Math.round(distance / 100) / 10} km`

  const distanceKm = Math.round(distance / 1000)
  return `${distanceKm > 900 ? '900+' : distanceKm} km`
}

export const formatDistance = (coords: Geoloc, position: Position): string | undefined => {
  if (!position || !coords) return

  const userLocation: Geoloc = {
    lat: position.latitude,
    lng: position.longitude,
  }

  const venueLocation: Geoloc = {
    lat: coords.lat,
    lng: coords.lng,
  }

  return getHumanizeRelativeDistance(userLocation, venueLocation)
}
