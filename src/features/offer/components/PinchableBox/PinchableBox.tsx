import {
  ReactNativeZoomableView,
  ZoomableViewEvent,
} from '@openspacelabs/react-native-zoomable-view'
import React from 'react'
import { PanResponderGestureState, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native'
// Importing FastImage for displaying offer images without resizing, prioritizing optimal quality for potential zooming.
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

type Props = {
  imageUrl: string
  style?: StyleProp<ViewStyle>
}

const blockNativeResponderOnInitialZoom = (
  _event: GestureResponderEvent,
  _gestureState: PanResponderGestureState,
  zoomableViewEventObject: ZoomableViewEvent
): boolean => {
  return zoomableViewEventObject.zoomLevel !== 1
}

export function PinchableBox({ imageUrl, style }: Readonly<Props>) {
  return (
    <ReactNativeZoomableView
      maxZoom={2}
      minZoom={1}
      doubleTapDelay={500}
      zoomStep={1}
      style={style}
      // We disable the pan on initial zoom to avoid the image moving when the user moves the carousel.
      onShouldBlockNativeResponder={blockNativeResponderOnInitialZoom}
      disablePanOnInitialZoom>
      <Image
        source={{
          uri: imageUrl,
        }}
      />
    </ReactNativeZoomableView>
  )
}

const Image = styled(FastImage).attrs({ resizeMode: 'contain' })({
  width: '100%',
  height: '100%',
})
