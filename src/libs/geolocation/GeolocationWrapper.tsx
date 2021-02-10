import React, { useContext, useEffect, useRef, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { checkGeolocPermission } from './checkGeolocPermission'
import { getPosition } from './getPosition'
import { requestGeolocPermission } from './requestGeolocPermission'

type RequestGeolocPermissionParams = {
  onAcceptance?: () => void
  onRefusal?: () => void
  onSubmit?: () => void
}

export interface IGeolocationContext {
  position: GeoCoordinates | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionGranted: boolean
  requestGeolocPermission: (params?: RequestGeolocPermissionParams) => Promise<void>
  checkGeolocPermission: () => Promise<void>
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  setPosition: () => undefined,
  permissionGranted: false,
  requestGeolocPermission: async () => {
    // nothing
  },
  checkGeolocPermission: async () => {
    // nothing
  },
})

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useState<GeoCoordinates | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const permissionGrantedRef = useRef<boolean>(false)

  useEffect(() => {
    if (permissionGranted && !permissionGrantedRef.current) {
      permissionGrantedRef.current = true
      getPosition(setPosition)
    }
  }, [permissionGranted])

  async function contextualRequestGeolocPermission(params?: RequestGeolocPermissionParams) {
    const isPermissionGranted = await requestGeolocPermission()
    setPermissionGranted(isPermissionGranted)

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
    setPermissionGranted(isPermissionGranted)
  }

  return (
    <GeolocationContext.Provider
      value={{
        position,
        setPosition,
        permissionGranted,
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
