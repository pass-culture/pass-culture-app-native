import React, { useContext, useEffect, useState } from 'react'
import { GeoCoordinates } from 'react-native-geolocation-service'

import { getPosition } from './getPosition'

export interface IGeolocationContext {
  position: GeoCoordinates | null
}

export const GeolocationContext = React.createContext<IGeolocationContext>({ position: null })

export const GeolocationWrapper = ({ children }: { children: Element }) => {
  const [position, setInitialPosition] = useState<GeoCoordinates | null>(null)

  useEffect(() => {
    getPosition(setInitialPosition)
  }, [])

  return <GeolocationContext.Provider value={{ position }}>{children}</GeolocationContext.Provider>
}

export function useGeolocation(): GeoCoordinates | null {
  const geolocationContext = useContext(GeolocationContext)
  if (!geolocationContext) return null
  return geolocationContext.position
}
