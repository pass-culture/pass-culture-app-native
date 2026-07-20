import { GeolocPermissionState, GeolocPositionError } from './geolocation/enums'

export enum LocationMode {
  AROUND_ME = 'AROUND_ME',
  AROUND_PLACE = 'AROUND_PLACE',
  EVERYWHERE = 'EVERYWHERE',
}

export const enum LocationLabel {
  everywhereLabel = 'France entière',
  aroundMeLabel = 'Ma position',
}

export type GeolocationError = {
  type: GeolocPositionError
  message: string
}

export type GeoCoordinates = {
  latitude: number
  longitude: number
}

// A position is either not yet asked (undefined), refused (null) or accepted and retrieved (coordinates)
export type Position = GeoCoordinates | null | undefined

export type AskGeolocPermission = () => Promise<GeolocPermissionState>
export type ReadGeolocPermission = () => Promise<GeolocPermissionState>
