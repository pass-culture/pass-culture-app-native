import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view'
import React from 'react'
// eslint-disable-next-line no-restricted-imports
import FastImage from 'react-native-fast-image'
import styled from 'styled-components/native'

type Props = {
  imageUrl: string
}

export function PinchableBox({ imageUrl }: Readonly<Props>) {
  return (
    <ZoomableView maxZoom={2} minZoom={1} doubleTapDelay={500} zoomStep={1}>
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

const ZoomableView = styled(ReactNativeZoomableView)({
  flex: 1,
})
