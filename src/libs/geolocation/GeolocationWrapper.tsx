import React, { useContext, useEffect, useRef, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { useRequestGeolocPermission } from 'libs/geolocation'

import { getPosition } from './getPosition'

export interface IGeolocationContext {
  position: GeoCoordinates | null
}

export const GeolocationContext = React.createContext<IGeolocationContext>({ position: null })

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)
  const permissionGranted = useRequestGeolocPermission()
  const permissionGrantedRef = useRef<boolean>(false)

  useEffect(() => {
    if (permissionGranted && !permissionGrantedRef.current) {
      permissionGrantedRef.current = true
      getPosition(setInitialPosition)
    }
  }, [permissionGranted])

  return <GeolocationContext.Provider value={{ position }}>{children}</GeolocationContext.Provider>
}

export function useGeolocation(): GeoCoordinates | null {
  const geolocationContext = useContext(GeolocationContext)
  if (!geolocationContext) return null
  return geolocationContext.position
}
