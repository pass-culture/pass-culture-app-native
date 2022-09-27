import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { Typo, GUTTER_DP } from 'ui/theme'

interface OfferCaptionProps {
  imageWidth: number
  name?: string
  date?: string
  isDuo?: boolean
  isBeneficiary?: boolean
  price: string
}

export const OfferCaption = (props: OfferCaptionProps) => {
  const { imageWidth, name, date, isDuo, isBeneficiary, price } = props
  const priceText = isDuo && isBeneficiary ? `${price} - Duo` : price
  return (
    <CaptionContainer imageWidth={imageWidth}>
      <Typo.Caption numberOfLines={2}>{name}</Typo.Caption>
      {!!date && <Typo.CaptionNeutralInfo numberOfLines={1}>{date}</Typo.CaptionNeutralInfo>}
      <Typo.CaptionNeutralInfo testID="priceIsDuo">{priceText}</Typo.CaptionNeutralInfo>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
