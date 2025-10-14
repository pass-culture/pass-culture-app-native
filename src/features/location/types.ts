import { MutableRefObject, Dispatch, SetStateAction } from 'react'

import { GeolocPermissionState } from 'libs/location/location'
import { RequestGeolocPermissionParams, LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

export type LocationState = {
  hasGeolocPosition: boolean
  place: SuggestedPlace | null
  setPlaceGlobally: (place: SuggestedPlace | null) => void
  onModalHideRef: MutableRefObject<(() => void) | undefined>
  permissionState: GeolocPermissionState | undefined
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  showGeolocPermissionModal: () => void
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
  tempAroundMeRadius: number
  setTempAroundMeRadius: Dispatch<SetStateAction<number>>
  tempAroundPlaceRadius: number
  setTempAroundPlaceRadius: Dispatch<SetStateAction<number>>
  tempLocationMode: LocationMode
  setTempLocationMode: Dispatch<SetStateAction<LocationMode>>
}

export type LocationSubmit = {
  onSubmit: (mode?: LocationMode) => void
  onClose: () => void
}
