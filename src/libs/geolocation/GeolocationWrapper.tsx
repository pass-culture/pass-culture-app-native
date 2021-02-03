import React, { useContext, useEffect, useRef, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { getPosition } from './getPosition'
import { requestGeolocPermission } from './requestGeolocPermission'

export interface IGeolocationContext {
  position: GeoCoordinates | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionGranted: boolean
  requestGeolocPermission: () => void
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  setPosition: () => undefined,
  permissionGranted: false,
  requestGeolocPermission: () => {
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

  function contextualRequestGeolocPermission() {
    requestGeolocPermission(setPermissionGranted)
  }

  return (
    <GeolocationContext.Provider
      value={{
        position,
        setPosition,
        permissionGranted,
        requestGeolocPermission: contextualRequestGeolocPermission,
      }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
