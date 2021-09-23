import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { VenueTypeCode } from 'api/gen'
import { mapVenueTypeToIcon, parseTypeHomeLabel } from 'libs/parsers'
import { Typo, GUTTER_DP, ColorsEnum, getSpacing, Spacer } from 'ui/theme'

interface VenueCaptionProps {
  imageWidth: number
  name: string
  venueType: VenueTypeCode
  distance?: string
}

export const VenueCaption = (props: VenueCaptionProps) => {
  const { imageWidth, name, venueType, distance } = props
  const typeLabel = parseTypeHomeLabel(venueType)
  const Icon = mapVenueTypeToIcon(venueType)

  return (
    <CaptionContainer imageWidth={imageWidth}>
      <VenueName>{name}</VenueName>
      <IconWithCaption>
        <Icon size={getSpacing(4)} color={ColorsEnum.GREY_DARK} />
        <Spacer.Row numberOfSpaces={1} />
        <TypeLabel>{typeLabel}</TypeLabel>
      </IconWithCaption>
      <Distance>{distance}</Distance>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ imageWidth: number }>(({ imageWidth }) => ({
  maxWidth: imageWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))

const VenueName = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})({})

const IconWithCaption = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const TypeLabel = styled(Typo.Caption).attrs({
  numberOfLines: 1,
  color: ColorsEnum.GREY_DARK,
})({ flexShrink: 1 })

const Distance = styled(Typo.Caption).attrs({
  color: ColorsEnum.GREY_DARK,
})({})
