import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { mapVenueTypeToIcon, parseTypeHomeLabel, VenueTypeCode } from 'libs/parsers'
import { Typo, GUTTER_DP, Spacer } from 'ui/theme'

interface VenueCaptionProps {
  width: number
  name: string
  venueType: VenueTypeCode | null
  distance?: string
}

export const VenueCaption = (props: VenueCaptionProps) => {
  const { width, name, venueType, distance } = props
  const typeLabel = parseTypeHomeLabel(venueType)
  const Icon = styled(mapVenueTypeToIcon(venueType)).attrs(({ theme }) => ({
    color: theme.colors.greyDark,
    size: theme.icons.sizes.extraSmall,
  }))``

  return (
    <CaptionContainer maxWidth={width}>
      <VenueName>{name}</VenueName>
      <IconWithCaption>
        <Icon />
        <Spacer.Row numberOfSpaces={1} />
        <TypeLabel>{typeLabel}</TypeLabel>
      </IconWithCaption>
      <Distance>{distance}</Distance>
    </CaptionContainer>
  )
}

const CaptionContainer = styled.View<{ maxWidth: number }>(({ maxWidth }) => ({
  maxWidth,
  marginTop: PixelRatio.roundToNearestPixel(GUTTER_DP / 2),
}))

const VenueName = styled(Typo.Caption).attrs({
  numberOfLines: 2,
})({})

const IconWithCaption = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})

const TypeLabel = styled(Typo.Caption).attrs({
  numberOfLines: 1,
})(({ theme }) => ({ flexShrink: 1, color: theme.colors.greyDark }))

const Distance = styled(Typo.Caption)(({ theme }) => ({ color: theme.colors.greyDark }))
