import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP } from 'ui/theme'

interface OfferCaptionProps {
  imageWidth: number
  price: string
  name?: string
  date?: string
}

export const OfferCaption = (props: OfferCaptionProps) => {
  const { imageWidth, name, date, price } = props
  return (
    <CaptionContainer imageWidth={imageWidth}>
      <Typo.Caption numberOfLines={2}>{name}</Typo.Caption>
      {date ? <Typo.CaptionNeutralInfo numberOfLines={1}>{date}</Typo.CaptionNeutralInfo> : null}
      <Typo.CaptionNeutralInfo testID="priceIsDuo">{price}</Typo.CaptionNeutralInfo>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
