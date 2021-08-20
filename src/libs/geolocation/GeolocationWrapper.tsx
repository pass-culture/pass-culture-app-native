import React, { memo, useContext, useEffect } from 'react'
import { Linking } from 'react-native'

import { useAppStateChange } from 'libs/appState'
import { GeolocationActivationModal } from 'libs/geolocation/components/GeolocationActivationModal'
import { useSafeState } from 'libs/hooks'
import { useModal } from 'ui/components/modals/useModal'

import { checkGeolocPermission } from './checkGeolocPermission'
import { GeolocPermissionState } from './enums'
import { getPosition } from './getPosition'
import { requestGeolocPermission } from './requestGeolocPermission'
import {
  GeolocationError,
  GeoCoordinates,
  IGeolocationContext,
  RequestGeolocPermissionParams,
} from './types'

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  positionError: null,
  permissionState: GeolocPermissionState.DENIED,
  requestGeolocPermission: async () => {
    // nothing
  },
  triggerPositionUpdate: () => undefined,
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

  function triggerPositionUpdate() {
    getPosition(setPosition, setPositionError)
  }

  // this function is used to set OS permissions according to user choice on native geolocation popup
  async function contextualRequestGeolocPermission(params?: RequestGeolocPermissionParams) {
    const newPermissionState = await requestGeolocPermission()
    setPermissionState(newPermissionState)

    !!params?.onSubmit && params.onSubmit()

    if (isGranted(newPermissionState)) {
      triggerPositionUpdate()
      !!params?.onAcceptance && params.onAcceptance()
    } else {
      !!params?.onRefusal && params.onRefusal()
    }
  }

  // in case user updates his preferences in his phone settings we check if his local
  // storage choice is consistent with phone permissions, and update position if not
  async function contextualCheckPermission() {
    const newPermissionState: GeolocPermissionState = await checkGeolocPermission()
    if (isGranted(newPermissionState)) {
      triggerPositionUpdate()
    } else {
      setPosition(null)
    }
    setPermissionState(newPermissionState)
  }

  // WARNING: the reference of contextualCheckPermission() changes between
  // - the registration of the "onAppBecomeActive" handler in the "useAppStateChange" effect
  // - and its execution (when app becomes active).
  // that's why it's very important to add the 'permissionState' to the dependencies of the "useAppStateChange" effect
  useAppStateChange(onAppBecomeActive, onAppBecomeInactive, [permissionState])
  async function onAppBecomeActive() {
    await contextualCheckPermission()
  }
  async function onAppBecomeInactive() {
    // nothing
  }

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

function isGranted(permissionState: GeolocPermissionState) {
  return permissionState === GeolocPermissionState.GRANTED
}
