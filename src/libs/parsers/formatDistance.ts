import { Geoloc } from 'libs/algolia/types'
import { Position } from 'libs/location/location'

export const EARTH_RADIUS = 6_378_137

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

const convertAngleToRadians = (angleInDegrees: number) => (angleInDegrees * Math.PI) / 180

// Explanation of the formula: ./formatDistance.md
export const computeDistanceInMeters = (latA: number, lngA: number, latB: number, lngB: number) => {
  const latAInRad = convertAngleToRadians(latA)
  const latBInRad = convertAngleToRadians(latB)
  const deltaLng = convertAngleToRadians(lngB) - convertAngleToRadians(lngA)

  const angleBetween = Math.acos(
    Math.sin(latAInRad) * Math.sin(latBInRad) +
      Math.cos(latAInRad) * Math.cos(latBInRad) * Math.cos(deltaLng)
  )

  return angleBetween * EARTH_RADIUS
}

const humanizeDistance = (distance: number) => {
  if (distance < 30) return `${Math.round(distance)} m`
  if (distance < 100) return `${Math.round(distance / 5) * 5} m`
  if (distance < 1000) return `${Math.round(distance / 10) * 10} m`
  if (distance < 5000) return `${Math.round(distance / 100) / 10} km`

  const distanceKm = Math.round(distance / 1000)
  return `${distanceKm > 900 ? '900+' : distanceKm} km`
}

export const formatDistance = (coords: Geoloc, userPosition: Position): string | undefined => {
  if (!userPosition || !coords) return

  const userLocation: Geoloc = {
    lat: userPosition.latitude,
    lng: userPosition.longitude,
  }

  const venueLocation: Geoloc = {
    lat: coords.lat,
    lng: coords.lng,
  }

  return getHumanizeRelativeDistance(userLocation, venueLocation)
}
