import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { View } from 'react-native'

import { MapViewProps } from 'libs/maps/maps'

// Définir le type pour la référence mockée
type MockMapRef = {
  getCamera: () => Promise<{ zoom: number; altitude: number }>
}

// Créer la référence mockée
const mockMapRef: React.MutableRefObject<MockMapRef> = {
  current: {
    getCamera: () =>
      Promise.resolve({
        zoom: 15,
        altitude: 3000,
      }),
  },
}

// Étendre les props de MapView pour inclure onMapReady
interface ExtendedMapViewProps extends MapViewProps {
  onMapReady?: () => void
}

const MapViewMock = forwardRef<MockMapRef, ExtendedMapViewProps>(function MapViewMock(props, ref) {
  useEffect(() => {
    props.onMapReady?.()
  }, [props])

  useImperativeHandle(ref, () => mockMapRef.current, [])

  return <View {...props} />
})

export default MapViewMock
