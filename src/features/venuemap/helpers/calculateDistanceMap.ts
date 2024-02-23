import { Region } from 'libs/maps/maps'
import { computeDistanceInMeters } from 'libs/parsers'

const EARTH_RADIUS_M = 6378137

// Calculates the horizontal distance in meters on the screen
// based on the radius in meters and the screen ratio.
export const calculateHorizontalDistance = (
  radiusInMeters: number,
  screenRatio: number
): number => {
  return radiusInMeters / Math.sqrt(1 + screenRatio * screenRatio)
}

// Calculates the vertical distance in meters on the screen
// based on the radius in meters and the screen ratio.
export const calculateVerticalDistance = (radiusInMeters: number, screenRatio: number): number => {
  return (radiusInMeters * screenRatio) / Math.sqrt(1 + screenRatio * screenRatio)
}

// Converts a vertical distance in meters to degrees of latitude.
export const distanceToLatitudeDelta = (distanceInMeters: number): number => {
  const distanceInRadians = distanceInMeters / EARTH_RADIUS_M
  return distanceInRadians * (180 / Math.PI)
}

// Converts a horizontal distance in meters to degrees of longitude.
export const distanceToLongitudeDelta = (
  distanceInMeters: number,
  latitudeInDegrees: number
): number => {
  const latitudeInRadians = (latitudeInDegrees * Math.PI) / 180
  const distanceInRadians = distanceInMeters / EARTH_RADIUS_M
  return (distanceInRadians / Math.cos(latitudeInRadians)) * (180 / Math.PI)
}

export const calculateRoundRadiusInKilometers = (region: Region): number => {
  const distanceInMeters = computeDistanceInMeters(
    region.latitude,
    region.longitude,
    region.latitude + region.latitudeDelta,
    region.longitude + region.longitudeDelta
  )

  // It is necessary to round to the whole number to avoid an error with the Algolia API
  return Math.round(distanceInMeters / 1000)
}
