import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Layout } from 'features/home/contentful'
import { BORDER_RADIUS, LENGTH_M, LENGTH_L, RATIO_ALGOLIA, MARGIN_DP } from 'ui/theme'

interface CoverProps {
  layout: Layout
  uri: string
}

export const Cover = ({ layout, uri }: CoverProps) => {
  const imageHeight = MARGIN_DP + (layout === 'two-items' ? LENGTH_M : LENGTH_L)
  const imageWidth = PixelRatio.roundToNearestPixel(imageHeight * RATIO_ALGOLIA)

  return (
    <Image imageHeight={imageHeight} imageWidth={imageWidth} source={{ uri }} testID="coverImage" />
  )
}

const Image = styled.Image<{ imageWidth: number; imageHeight: number }>(
  ({ imageWidth, imageHeight }) => ({
    height: imageHeight,
    width: imageWidth,
    borderRadius: BORDER_RADIUS,
  })
)
