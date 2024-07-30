import React from 'react'
import MapView from 'react-native-map-clustering'

const MapViewMock = React.forwardRef(function Component(
  props: {
    onMapReady?: () => void
  },
  ref: unknown
) {
  React.useEffect(() => {
    props.onMapReady?.()
  }, [props])

  // @ts-ignore avoid internal typing complexity
  return React.createElement(MapView, { ref, ...props })
})

export default MapViewMock
