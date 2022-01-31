import React from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { mapVenueTypeToIcon, parseTypeHomeLabel } from 'libs/parsers'
import { Typo, GUTTER_DP, getSpacing, Spacer } from 'ui/theme'
// eslint-disable-next-line no-restricted-imports
import { ColorsEnum } from 'ui/theme/colors'

interface VenueCaptionProps {
  width: number
  name: string
  venueType: VenueTypeCodeKey | null
  distance?: string
}

export const VenueCaption = (props: VenueCaptionProps) => {
  const { width, name, venueType, distance } = props
  const typeLabel = parseTypeHomeLabel(venueType)
  const Icon = mapVenueTypeToIcon(venueType)

  return (
    <CaptionContainer maxWidth={width}>
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
