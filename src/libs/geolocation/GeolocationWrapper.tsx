import React, { useContext, useEffect } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { useAppStateChange } from 'libs/appState'
import { useSafeState } from 'libs/hooks'

import { checkGeolocPermission } from './checkGeolocPermission'
import { getPosition, GeolocationError } from './getPosition'
import { GeolocPermissionState } from './permissionState.d'
import { requestGeolocPermission } from './requestGeolocPermission'

type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}

export interface IGeolocationContext {
  position: GeoCoordinates | null
  positionError: GeolocationError | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionState: GeolocPermissionState
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  checkGeolocPermission: () => Promise<void>
  triggerPositionUpdate: () => void
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  positionError: null,
  setPosition: () => undefined,
  permissionState: GeolocPermissionState.DENIED,
  requestGeolocPermission: async () => {
    // nothing
  },
  checkGeolocPermission: async () => {
    // nothing
  },
  triggerPositionUpdate: () => undefined,
})

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useSafeState<GeoCoordinates | null>(null)
  const [positionError, setPositionError] = useSafeState<GeolocationError | null>(null)
  const [permissionState, setPermissionState] = useSafeState<GeolocPermissionState>(
    GeolocPermissionState.DENIED
  )

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
    triggerPositionUpdate()

    if (params?.onSubmit) {
      params.onSubmit()
    }
    const isPermissionGranted = newPermissionState === GeolocPermissionState.GRANTED
    if (isPermissionGranted && params?.onAcceptance) {
      params.onAcceptance()
    } else if (!isPermissionGranted && params?.onRefusal) {
      params.onRefusal()
    }
  }

  // in case user updates his preferences in his phone settings we check if his local
  // storage choice is consistent with phone permissions, and update position if not
  async function contextualCheckPermission() {
    const newPermissionState: GeolocPermissionState = await checkGeolocPermission()
    triggerPositionUpdate()
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

  return (
    <GeolocationContext.Provider
      value={{
        position,
        positionError,
        setPosition,
        permissionState,
        requestGeolocPermission: contextualRequestGeolocPermission,
        checkGeolocPermission: contextualCheckPermission,
        triggerPositionUpdate,
      }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
