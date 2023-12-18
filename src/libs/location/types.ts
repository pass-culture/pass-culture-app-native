import { Dispatch, MutableRefObject, SetStateAction } from 'react'

import { SuggestedPlace } from 'libs/place'

import { GeolocPermissionState, GeolocPositionError } from './enums'

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
  isGeolocated: boolean
  isCustomPosition?: boolean
  place: SuggestedPlace | null
  setPlace: (place: SuggestedPlace | null) => void
  onModalHideRef: MutableRefObject<(() => void) | undefined>
  userPosition: Position
  customPosition: Position
  setCustomPosition: Dispatch<SetStateAction<Position>>
  userPositionError: GeolocationError | null
  permissionState: GeolocPermissionState | undefined
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  triggerPositionUpdate: () => void
  showGeolocPermissionModal: () => void
  onPressGeolocPermissionModalButton: () => void
}
