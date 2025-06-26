import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: string
  onPressArtistLink?: () => void
}
export const OfferArtists: FunctionComponent<Props> = ({ artists, onPressArtistLink }) => {
  const artistLinkEnabled = !!onPressArtistLink
  const prefix = 'de'
  return (
    <ArtistInfoContainer gap={2}>
      <StyledPrefix>{prefix}</StyledPrefix>
      {artistLinkEnabled ? (
        <ButtonTertiaryBlack
          wording={artists}
          icon={ArrowNext}
          inline
          buttonHeight="extraSmall"
          accessibilityLabel={`Accéder à la page de ${artists}`}
          iconPosition="right"
          onPress={onPressArtistLink}
        />
      ) : (
        <ArtistsText
          allowFontScaling={false}
          numberOfLines={2}
          {...getHeadingAttrs(1)}
          {...accessibilityAndTestId(`Nom de l’artiste\u00a0: ${artists}`)}>
          {artists}
        </ArtistsText>
      )}
    </ArtistInfoContainer>
  )
}

const ArtistsText = styled(Typo.BodyAccent)({
  flex: 1,
})

const ArtistInfoContainer = styled(ViewGap)({
  flexDirection: 'row',
})

const StyledPrefix = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
