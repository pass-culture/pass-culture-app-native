import React, { memo, useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Linking } from 'react-native'

import { useAppStateChange } from 'libs/appState'
import { getPosition } from 'libs/geolocation/getPosition'
import { requestGeolocPermission } from 'libs/geolocation/requestGeolocPermission'
import { useSafeState } from 'libs/hooks'
import { SuggestedPlace } from 'libs/place'
import { storage } from 'libs/storage'
import { useModal } from 'ui/components/modals/useModal'

import { checkGeolocPermission } from './checkGeolocPermission'
import { GeolocationActivationModal } from './components/GeolocationActivationModal'
import { GeolocPermissionState } from './enums'
import {
  GeolocationError,
  ILocationContext,
  Position,
  RequestGeolocPermissionParams,
} from './types'

/* eslint-disable @typescript-eslint/no-empty-function */
const LocationContext = React.createContext<ILocationContext>({
  userPosition: undefined,
  customPosition: undefined,
  setCustomPosition: () => null,
  userPositionError: null,
  permissionState: undefined,
  requestGeolocPermission: async () => {},
  triggerPositionUpdate: () => null,
  showGeolocPermissionModal: () => null,
  onPressGeolocPermissionModalButton: () => null,
  place: null,
  setPlace: () => {},
  onModalHideRef: { current: undefined },
  isGeolocated: false,
})
/* eslint-enable @typescript-eslint/no-empty-function */

export const LocationWrapper = memo(function LocationWrapper({
  children,
}: {
  children: React.JSX.Element
}) {
  const [userPosition, setUserPosition] = useSafeState<Position>(undefined)
  const [customPosition, setCustomPosition] = useSafeState<Position>(undefined)
  const [place, setPlace] = useSafeState<SuggestedPlace | null>(null)
  const [userPositionError, setUserPositionError] = useSafeState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] = useSafeState<GeolocPermissionState | undefined>(
    undefined
  )
  const isGeolocated = !!userPosition
  const isCustomPosition = !!customPosition
  const onModalHideRef = useRef<() => void>()

  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  useEffect(() => {
    contextualCheckPermission()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const triggerPositionUpdate = useCallback(async () => {
    try {
      const newPosition = await getPosition()
      setUserPosition(newPosition)
      setUserPositionError(null)
      return newPosition
    } catch (newPositionError) {
      setUserPosition(null)
      setUserPositionError(newPositionError as GeolocationError)
      return null
    }
  }, [setUserPosition, setUserPositionError])

  // this function is used to set OS permissions according to user choice on native geolocation popup
  const contextualRequestGeolocPermission = useCallback(
    async function (params?: RequestGeolocPermissionParams) {
      !!params?.onSubmit && params.onSubmit()

      let permission = await requestGeolocPermission()
      if (shouldTriggerPositionUpdate(permission)) {
        const newPosition = await triggerPositionUpdate()
        if (isNeedAskPosition(permission)) {
          permission =
            newPosition === null
              ? GeolocPermissionState.NEVER_ASK_AGAIN
              : GeolocPermissionState.GRANTED
        }
      }

      if (isGranted(permission)) {
        !!params?.onAcceptance && params.onAcceptance()
      } else {
        !!params?.onRefusal && params.onRefusal()
      }
      setPermissionState(permission)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // in case user updates his preferences in his phone settings we check if his local
  // storage choice is consistent with phone permissions, and update position if not
  const contextualCheckPermission = useCallback(async function () {
    let permission = await checkGeolocPermission()
    if (shouldTriggerPositionUpdate(permission)) {
      const newPosition = await triggerPositionUpdate()
      if (isNeedAskPosition(permission)) {
        permission =
          newPosition === null
            ? GeolocPermissionState.NEVER_ASK_AGAIN
            : GeolocPermissionState.GRANTED
      }
    }
    setPermissionState(permission)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isRejected(permissionState)) {
      setUserPosition(null)
      setUserPositionError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  useAppStateChange(contextualCheckPermission, undefined, [])

  const onPressGeolocPermissionModalButton = useCallback(() => {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }, [hideGeolocPermissionModal])

  useEffect(() => {
    setCustomPosition(place?.geolocation)
  }, [
    place?.geolocation,
    place?.geolocation?.latitude,
    place?.geolocation?.longitude,
    setCustomPosition,
  ])

  useEffect(() => {
    switch (true) {
      case isCustomPosition:
        storage.saveString('location_type', 'UserSpecificLocation')
        break
      case isGeolocated:
        storage.saveString('location_type', 'UserGeolocation')
        break
      default:
        storage.clear('location_type')
        break
    }
  }, [isGeolocated, isCustomPosition])

  const value = useMemo(
    () => ({
      userPosition,
      userPositionError,
      customPosition,
      permissionState,
      isGeolocated,
      isCustomPosition,
      onModalHideRef,
      requestGeolocPermission: contextualRequestGeolocPermission,
      triggerPositionUpdate,
      onPressGeolocPermissionModalButton,
      setCustomPosition,
      place,
      setPlace,
      showGeolocPermissionModal,
    }),
    [
      userPosition,
      userPositionError,
      customPosition,
      permissionState,
      isGeolocated,
      isCustomPosition,
      setCustomPosition,
      contextualRequestGeolocPermission,
      triggerPositionUpdate,
      onPressGeolocPermissionModalButton,
      place,
      setPlace,
      showGeolocPermissionModal,
    ]
  )
  return (
    <LocationContext.Provider value={value}>
      {children}
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    </LocationContext.Provider>
  )
})

export function useLocation(): ILocationContext {
  return useContext(LocationContext)
}

function isGranted(permission: GeolocPermissionState) {
  return permission === GeolocPermissionState.GRANTED
}
function isRejected(permission: GeolocPermissionState | undefined) {
  return (
    !permission ||
    permission === GeolocPermissionState.DENIED ||
    permission === GeolocPermissionState.NEVER_ASK_AGAIN
  )
}
function isNeedAskPosition(permission: GeolocPermissionState) {
  return permission === GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY
}
function shouldTriggerPositionUpdate(permission: GeolocPermissionState) {
  return isGranted(permission) || isNeedAskPosition(permission)
}
