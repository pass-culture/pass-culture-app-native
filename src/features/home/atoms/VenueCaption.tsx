import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP } from 'ui/theme'

interface VenueCaptionProps {
  imageWidth: number
  name?: string
}

export const VenueCaption = (props: VenueCaptionProps) => {
  const { imageWidth, name } = props

  return (
    <CaptionContainer imageWidth={imageWidth}>
      <Typo.Caption numberOfLines={1}>{name}</Typo.Caption>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
