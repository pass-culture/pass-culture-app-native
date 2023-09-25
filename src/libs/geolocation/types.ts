import { Dispatch, MutableRefObject, SetStateAction } from 'react'

import { LocationOption } from 'features/location/enums'
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
  isCurrentLocationMode: (target: LocationOption) => boolean
  runGeolocationDialogs: () => void
  setPlace: (place: SuggestedPlace | null) => void
  setSelectedOption: (location: LocationOption) => void
  initialize: () => void
  onModalHideRef: MutableRefObject<(() => void) | undefined>
  getLocationTitle: (defaultTitle: {
    isGeolocatedTitle: string
    isNotGeolocatedTitle: string
  }) => string
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
