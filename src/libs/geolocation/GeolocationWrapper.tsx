import React, { memo, useCallback, useContext, useEffect } from 'react'
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
  GeoCoordinates,
  IGeolocationContext,
  RequestGeolocPermissionParams,
} from './types'

const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  positionError: null,
  permissionState: GeolocPermissionState.DENIED,
  requestGeolocPermission: async () => {
    // nothing
  },
  triggerPositionUpdate: () => null,
  showGeolocPermissionModal: () => null,
})

export const GeolocationWrapper = memo(function GeolocationWrapper({
  children,
}: {
  children: JSX.Element
}) {
  const [position, setPosition] = useSafeState<GeoCoordinates | null>(null)
  const [positionError, setPositionError] = useSafeState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] = useSafeState<GeolocPermissionState>(
    GeolocPermissionState.DENIED
  )

  const {
    visible: isGeolocPermissionModalVisible,
    showModal: showGeolocPermissionModal,
    hideModal: hideGeolocPermissionModal,
  } = useModal(false)

  useEffect(() => {
    contextualCheckPermission()
  }, [])

  async function triggerPositionUpdate() {
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
  }

  // this function is used to set OS permissions according to user choice on native geolocation popup
  const contextualRequestGeolocPermission = useCallback(async function (
    params?: RequestGeolocPermissionParams
  ) {
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
  [])

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
  }, [])

  useEffect(() => {
    if (isRejected(permissionState)) {
      setPosition(null)
      setPositionError(null)
    }
  }, [permissionState])

  useAppStateChange(contextualCheckPermission, undefined, [])

  function onPressGeolocPermissionModalButton() {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }

  return (
    <GeolocationContext.Provider
      value={{
        position,
        positionError,
        permissionState,
        requestGeolocPermission: contextualRequestGeolocPermission,
        triggerPositionUpdate,
        showGeolocPermissionModal,
      }}>
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
function isRejected(permission: GeolocPermissionState) {
  return (
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
