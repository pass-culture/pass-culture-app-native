import React, { useContext, useEffect, useRef, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { useRequestGeolocPermission } from 'libs/geolocation'

import { getPosition } from './getPosition'

export interface IGeolocationContext {
  position: GeoCoordinates | null
  setPosition: (position: GeoCoordinates | null) => void
  permissionGranted: boolean
}

export const GeolocationContext = React.createContext<IGeolocationContext>({
  position: null,
  setPosition: () => undefined,
})

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setPosition] = useState<GeoCoordinates | null>(null)
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)
  const permissionGranted = useRequestGeolocPermission()
  const permissionGrantedRef = useRef<boolean>(false)

  useEffect(() => {
    if (permissionGranted && !permissionGrantedRef.current) {
      permissionGrantedRef.current = true
      getPosition(setPosition)
    }
  }, [permissionGranted])

  return (
    <GeolocationContext.Provider value={{ position, setPosition }}>
      {children}
    </GeolocationContext.Provider>
  )
}

export function useGeolocation(): IGeolocationContext {
  return useContext(GeolocationContext)
}
