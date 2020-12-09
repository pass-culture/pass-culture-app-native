import { t } from '@lingui/macro'
import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ColorsEnum, Typo, GUTTER_DP } from 'ui/theme'

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

  return (
    <CaptionContainer imageWidth={imageWidth}>
      <Typo.Caption numberOfLines={1}>{name}</Typo.Caption>
      {date && (
        <Typo.Caption numberOfLines={1} color={ColorsEnum.GREY_DARK}>
          {date}
        </Typo.Caption>
      )}
      <Typo.Caption color={ColorsEnum.GREY_DARK} testID="priceIsDuo">
        {isDuo && isBeneficiary ? `${price} - ${_(/*i18n: Duo offer */ t`Duo`)}` : price}
      </Typo.Caption>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))
