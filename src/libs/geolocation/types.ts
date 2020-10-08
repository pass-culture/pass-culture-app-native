export interface GeoLocationCoordinates {
  latitude?: number
  longitude?: number
  altitude?: number | null
  accuracy?: number
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
}
