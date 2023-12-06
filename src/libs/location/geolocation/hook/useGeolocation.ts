import { useCallback, useEffect } from 'react'
import { Linking } from 'react-native'

import { useAppStateChange } from 'libs/appState'
import { useSafeState } from 'libs/hooks'
import { checkGeolocPermission } from 'libs/location/geolocation/checkGeolocPermission/checkGeolocPermission'
import { GeolocPermissionState } from 'libs/location/geolocation/enums'
import { getGeolocPosition } from 'libs/location/geolocation/getGeolocPosition/getGeolocPosition'
import { requestGeolocPermission } from 'libs/location/geolocation/requestGeolocPermission/requestGeolocPermission'
import { GeolocationError, Position, RequestGeolocPermissionParams } from 'libs/location/types'
import { useModal } from 'ui/components/modals/useModal'

export const useGeolocation = () => {
  const [geolocPosition, setGeolocPosition] = useSafeState<Position>(undefined)
  const [geolocPositionError, setGeolocPositionError] = useSafeState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] = useSafeState<GeolocPermissionState | undefined>(
    undefined
  )
  const hasGeolocPosition = !!geolocPosition

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
      const newPosition = await getGeolocPosition()
      setGeolocPosition(newPosition)
      setGeolocPositionError(null)
      return newPosition
    } catch (newPositionError) {
      setGeolocPosition(null)
      setGeolocPositionError(newPositionError as GeolocationError)
      return null
    }
  }, [setGeolocPosition, setGeolocPositionError])

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
      setGeolocPosition(null)
      setGeolocPositionError(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionState])

  useAppStateChange(contextualCheckPermission, undefined, [])

  const onPressGeolocPermissionModalButton = useCallback(() => {
    Linking.openSettings()
    hideGeolocPermissionModal()
  }, [hideGeolocPermissionModal])

  return {
    geolocPosition,
    geolocPositionError,
    permissionState,
    hasGeolocPosition,
    triggerPositionUpdate,
    onPressGeolocPermissionModalButton,
    isGeolocPermissionModalVisible,
    showGeolocPermissionModal,
    contextualRequestGeolocPermission,
    hideGeolocPermissionModal,
  }
}

function isRejected(permission: GeolocPermissionState | undefined) {
  return (
    !permission ||
    permission === GeolocPermissionState.DENIED ||
    permission === GeolocPermissionState.NEVER_ASK_AGAIN
  )
}

function isGranted(permission: GeolocPermissionState) {
  return permission === GeolocPermissionState.GRANTED
}

function isNeedAskPosition(permission: GeolocPermissionState) {
  return permission === GeolocPermissionState.NEED_ASK_POSITION_DIRECTLY
}

function shouldTriggerPositionUpdate(permission: GeolocPermissionState) {
  return isGranted(permission) || isNeedAskPosition(permission)
}
