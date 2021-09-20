import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP, ColorsEnum } from 'ui/theme'

interface VenueCaptionProps {
  imageWidth: number
  name?: string
  venueType?: string
}

export const VenueCaption = (props: VenueCaptionProps) => {
  const { imageWidth, name, venueType } = props

  return (
    <CaptionContainer imageWidth={imageWidth}>
      <Typo.Caption numberOfLines={1}>{name}</Typo.Caption>
      <Typo.Caption numberOfLines={1} color={ColorsEnum.GREY_DARK}>
        {venueType}
      </Typo.Caption>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
