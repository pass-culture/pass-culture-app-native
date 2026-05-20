import { MutableRefObject } from 'react'

import { GeolocPermissionState } from 'libs/location/location'
import { RequestGeolocPermissionParams, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

export type LocationState = {
  hasGeolocPosition: boolean
  place: SuggestedPlace | null
  setPlace: (place: SuggestedPlace | null) => void
  onModalHideRef: MutableRefObject<(() => void) | undefined>
  permissionState: GeolocPermissionState | null
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  showGeolocPermissionModal: () => void
  selectedLocationMode: LocationMode
  setSelectedLocationMode: (locationMode: LocationMode) => void
  selectedPlace: SuggestedPlace | null
  setSelectedPlace: (place: SuggestedPlace | null) => void
  onResetPlace: () => void
  placeQuery: string
  setPlaceQuery: (placeQuery: string) => void
  aroundPlaceRadius: number
  setAroundPlaceRadius: (radius: number) => void
  aroundMeRadius: number
  setAroundMeRadius: (radius: number) => void
  tempAroundMeRadius: number
  setTempAroundMeRadius: (radius: number) => void
  tempAroundPlaceRadius: number
  setTempAroundPlaceRadius: (radius: number) => void
  tempLocationMode: LocationMode
  setTempLocationMode: (locationMode: LocationMode) => void
}

export type LocationSubmit = {
  onSubmit: (mode?: LocationMode) => void
  onClose: () => void
}
