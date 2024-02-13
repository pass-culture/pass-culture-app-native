import React from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: string | undefined
  numberOfLines?: number
}

export function OfferArtists({ artists, numberOfLines = 2 }: Readonly<Props>) {
  return artists ? (
    <ArtistsText
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      {...getHeadingAttrs(1)}
      {...accessibilityAndTestId(`Nom de l’artiste\u00a0: ${artists}`)}>
      de {artists}
    </ArtistsText>
  ) : null
}

const ArtistsText = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.greyDark,
}))
