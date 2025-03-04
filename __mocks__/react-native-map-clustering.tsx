import React, { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Pressable } from 'react-native'
// eslint-disable-next-line no-restricted-imports
import { MapPressEvent } from 'react-native-maps'

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
  onRegionChange?: () => void
}

const MapViewMock = forwardRef<MockMapRef, ExtendedMapViewProps>(function MapViewMock(props, ref) {
  useEffect(() => {
    props.onMapReady?.()
    props.onRegionChange?.()
  }, [props])

  const { onPress: onMapPress, onLongPress: _, ...otherProps } = props

  useImperativeHandle(ref, () => mockMapRef.current, [])

  return (
    <Pressable
      onPress={() => {
        onMapPress?.({} as MapPressEvent)
      }}
      {...otherProps}
    />
  )
})

export default MapViewMock
