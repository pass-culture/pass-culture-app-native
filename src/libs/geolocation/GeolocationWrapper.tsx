import React, { useContext, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { useAppStateChange } from 'features/offer/pages/useAppStateChange'

import { checkGeolocPermission } from './checkGeolocPermission'
import { getPosition } from './getPosition'
import { GeolocPermissionState } from './permissionState.d'
import { requestGeolocPermission } from './requestGeolocPermission'

type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}

export interface IGeolocationContext {
  position: GeoCoordinates | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionState: GeolocPermissionState
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  checkGeolocPermission: () => Promise<void>
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  setPosition: () => undefined,
  permissionState: GeolocPermissionState.DENIED,
  requestGeolocPermission: async () => {
    // nothing
  },
  checkGeolocPermission: async () => {
    // nothing
  },
})

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useState<GeoCoordinates | null>(null)
  const [permissionState, setPermissionState] = useState<GeolocPermissionState>(
    GeolocPermissionState.DENIED
  )
  const permissionStateRef = useRef<boolean>(false)

  useEffect(() => {
    if (permissionState === GeolocPermissionState.GRANTED && !permissionStateRef.current) {
      permissionStateRef.current = true
      getPosition(setPosition)
    }
  }, [permissionState])

  async function contextualRequestGeolocPermission(params?: RequestGeolocPermissionParams) {
    const permissionState = await requestGeolocPermission()
    setPermissionState(permissionState)
    const isPermissionGranted = permissionState === GeolocPermissionState.GRANTED

    if (params?.onSubmit) {
      params.onSubmit()
    }
    if (isPermissionGranted && params?.onAcceptance) {
      params.onAcceptance()
    } else if (!isPermissionGranted && params?.onRefusal) {
      params.onRefusal()
    }
  }

  const contextualCheckPermission = async () => {
    const isPermissionGranted = await checkGeolocPermission()
    if (isPermissionGranted) setPermissionState(GeolocPermissionState.GRANTED)
  }

  const onAppBecomeActive = async () => {
    await contextualCheckPermission()
  }
  const onAppBecomeInactive = async () => {
    // nothing
  }
  useAppStateChange(onAppBecomeActive, onAppBecomeInactive)

  return (
    <GeolocationContext.Provider
      value={{
        position,
        setPosition,
        permissionState,
        requestGeolocPermission: contextualRequestGeolocPermission,
        checkGeolocPermission: contextualCheckPermission,
      }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
