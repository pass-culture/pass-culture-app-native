import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { GreyDarkCaption } from 'ui/components/GreyDarkCaption'
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
      {!!date && <GreyDarkCaption numberOfLines={1}>{date}</GreyDarkCaption>}
      <GreyDarkCaption testID="priceIsDuo">
        {isDuo && isBeneficiary
          ? t({
              id: 'price',
              values: { price },
              message: '{price} - Duo',
            })
          : price}
      </GreyDarkCaption>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
