import { Dispatch, MutableRefObject, SetStateAction } from 'react'

import { SuggestedPlace } from 'libs/place'

import { GeolocPermissionState, GeolocPositionError } from './geolocation/enums'

export enum LocationMode {
  AROUND_ME = 'AROUND_ME',
  AROUND_PLACE = 'AROUND_PLACE',
  EVERYWHERE = 'EVERYWHERE',
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

export type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}
export type AskGeolocPermission = () => Promise<GeolocPermissionState>
export type ReadGeolocPermission = () => Promise<GeolocPermissionState>

export type ILocationContext = {
  hasGeolocPosition: boolean
  place: SuggestedPlace | null
  setPlace: (place: SuggestedPlace | null) => void
  onModalHideRef: MutableRefObject<(() => void) | undefined>
  geolocPosition: Position
  geolocPositionError: GeolocationError | null
  permissionState: GeolocPermissionState | undefined
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  triggerPositionUpdate: () => void
  showGeolocPermissionModal: () => void
  onPressGeolocPermissionModalButton: () => void
  selectedLocationMode: LocationMode
  setSelectedLocationMode: Dispatch<SetStateAction<LocationMode>>
  selectedPlace: SuggestedPlace | null
  setSelectedPlace: Dispatch<SetStateAction<SuggestedPlace | null>>
  onSetSelectedPlace: (place: SuggestedPlace) => void
  onResetPlace: () => void
  placeQuery: string
  setPlaceQuery: Dispatch<SetStateAction<string>>
  aroundPlaceRadius: number
  setAroundPlaceRadius: Dispatch<SetStateAction<number>>
  aroundMeRadius: number
  setAroundMeRadius: Dispatch<SetStateAction<number>>
}
