import { GeolocPermissionState, GeolocPositionError } from './enums'

export type GeolocationError = {
  type: GeolocPositionError
  message: string
}

export type GeoCoordinates = {
  latitude: number
  longitude: number
}

export type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}
export type AskGeolocPermission = () => Promise<GeolocPermissionState>
export type ReadGeolocPermission = () => Promise<GeolocPermissionState>

export type IGeolocationContext = {
  position: GeoCoordinates | null
  positionError: GeolocationError | null
  permissionState: GeolocPermissionState
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  triggerPositionUpdate: () => void
  showGeolocPermissionModal: () => void
  onPressGeolocPermissionModalButton: () => void
}
