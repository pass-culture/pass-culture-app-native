import React, { useContext, useEffect, useRef, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { requestGeolocPermissionRoutine } from 'libs/geolocation'

import { getPosition } from './getPosition'

export interface IGeolocationContext {
  position: GeoCoordinates | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionGranted: boolean
  setPermissionGranted: (granted: boolean) => void
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  setPosition: () => undefined,
  permissionGranted: false,
  setPermissionGranted: () => undefined,
})

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useState<GeoCoordinates | null>(null)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  requestGeolocPermissionRoutine(setPermissionGranted)
  const permissionGrantedRef = useRef<boolean>(false)

  useEffect(() => {
    if (permissionGranted && !permissionGrantedRef.current) {
      permissionGrantedRef.current = true
      getPosition(setPosition)
    }
  }, [permissionGranted])

  return (
    <GeolocationContext.Provider
      value={{ position, setPosition, permissionGranted, setPermissionGranted }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
