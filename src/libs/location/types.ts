import { SuggestedPlace } from 'libs/place/types'

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

export type UseLocationReturnType = {
  hasGeolocPosition: boolean
  place: SuggestedPlace | null
  setPlace: (place: SuggestedPlace | null) => void
  geolocPosition: Position
  geolocPositionError: GeolocationError | null
  permissionState: GeolocPermissionState | null
  selectedLocationMode: LocationMode
  setSelectedLocationMode: (locationMode: LocationMode) => void
  selectedPlace: SuggestedPlace | null
  setSelectedPlace: (place: SuggestedPlace | null) => void
  onResetPlace: () => void
  setPlaceQuery: (placeQuery: string) => void
  aroundPlaceRadius: number
  setAroundPlaceRadius: (radius: number) => void
  aroundMeRadius: number
  setAroundMeRadius: (radius: number) => void
  userLocation: Position
}
