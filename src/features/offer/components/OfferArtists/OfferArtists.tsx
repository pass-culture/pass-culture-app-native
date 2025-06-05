import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: string
  onPressArtistLink?: () => void
}
export const OfferArtists: FunctionComponent<Props> = ({ artists, onPressArtistLink }) => {
  const artistLinkEnabled = !!onPressArtistLink
  const prefix = 'de'
  return (
    <ArtistInfoContainer>
      <StyledPrefix>{prefix}</StyledPrefix>
      <Spacer.Row numberOfSpaces={2} />
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

const ArtistInfoContainer = styled.View({
  flexDirection: 'row',
})

const StyledPrefix = styled(Typo.BodyAccent)(({ theme }) => ({
  color: theme.designSystem.color.text.subtle,
}))
