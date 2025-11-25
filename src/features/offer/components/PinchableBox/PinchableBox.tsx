// Importing FastImage for displaying offer images without resizing, prioritizing optimal quality for potential zooming.
// eslint-disable-next-line no-restricted-imports
import FastImage from '@d11/react-native-fast-image'
import {
  ReactNativeZoomableView,
  ZoomableViewEvent,
} from '@openspacelabs/react-native-zoomable-view'
import React from 'react'
import { PanResponderGestureState, GestureResponderEvent } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  imageUrl: string
}

const blockNativeResponderOnInitialZoom = (
  _event: GestureResponderEvent,
  _gestureState: PanResponderGestureState,
  zoomableViewEventObject: ZoomableViewEvent
): boolean => {
  return zoomableViewEventObject.zoomLevel !== 1
}

export function PinchableBox({ imageUrl }: Readonly<Props>) {
  return (
    <ZoomableView
      maxZoom={2}
      minZoom={1}
      doubleTapDelay={500}
      zoomStep={1}
      // We disable the pan on initial zoom to avoid the image moving when the user moves the carousel.
      onShouldBlockNativeResponder={blockNativeResponderOnInitialZoom}
      disablePanOnInitialZoom>
      <Image
        source={{
          uri: imageUrl,
        }}
      />
    </ZoomableView>
  )
}

const Image = styled(FastImage).attrs({ resizeMode: 'contain' })({
  width: '100%',
  height: '100%',
})

// @ts-expect-error - type incompatibility with React 19
const ZoomableView = styled(ReactNativeZoomableView)({
  flex: 1,
})
