import React, { memo, useCallback, useContext, useEffect, useMemo } from 'react'
import { Linking } from 'react-native'

import { useAppStateChange } from 'libs/appState'
import { useSafeState } from 'libs/hooks'
import { useModal } from 'ui/components/modals/useModal'

import { checkGeolocPermission } from './checkGeolocPermission'
import { GeolocationActivationModal } from './components/GeolocationActivationModal'
import { GeolocPermissionState } from './enums'
import { getPosition } from './getPosition'
import { requestGeolocPermission } from './requestGeolocPermission'
import {
  GeolocationError,
  IGeolocationContext,
  RequestGeolocPermissionParams,
  Position,
} from './types'

const GeolocationContext = React.createContext<IGeolocationContext>({
  position: undefined,
  positionError: null,
  permissionState: undefined,
  requestGeolocPermission: async () => {
    // nothing
  },
  triggerPositionUpdate: () => null,
  showGeolocPermissionModal: () => null,
  onPressGeolocPermissionModalButton: () => null,
})

export const GeolocationWrapper = memo(function GeolocationWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const [position, setPosition] = useSafeState<Position>(undefined)
  const [positionError, setPositionError] = useSafeState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] = useSafeState<GeolocPermissionState | undefined>(
    undefined
  )

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
      setPosition(newPosition)
      setPositionError(null)
      return newPosition
    } catch (newPositionError) {
      setPosition(null)
      setPositionError(newPositionError as GeolocationError)
      return null
    }
  }, [setPosition, setPositionError])

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
      setPosition(null)
      setPositionError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  useAppStateChange(contextualCheckPermission, undefined, [])

  const onPressGeolocPermissionModalButton = useCallback(() => {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }, [hideGeolocPermissionModal])

  const value = useMemo(
    () => ({
      position,
      positionError,
      permissionState,
      requestGeolocPermission: contextualRequestGeolocPermission,
      triggerPositionUpdate,
      showGeolocPermissionModal,
      onPressGeolocPermissionModalButton,
    }),
    [
      contextualRequestGeolocPermission,
      permissionState,
      position,
      positionError,
      showGeolocPermissionModal,
      triggerPositionUpdate,
      onPressGeolocPermissionModalButton,
    ]
  )
  return (
    <GeolocationContext.Provider value={value}>
      {children}
      <GeolocationActivationModal
        isGeolocPermissionModalVisible={isGeolocPermissionModalVisible}
        hideGeolocPermissionModal={hideGeolocPermissionModal}
        onPressGeolocPermissionModalButton={onPressGeolocPermissionModalButton}
      />
    </GeolocationContext.Provider>
  )
})

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
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
