import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: string
  numberOfLines?: number
  shouldDisplayFakeDoor?: boolean
}

export const OfferArtists: FunctionComponent<Props> = ({
  artists,
  numberOfLines = 2,
  shouldDisplayFakeDoor,
}) => {
  return shouldDisplayFakeDoor ? (
    <FakeDoorContainer>
      <Typo.ButtonTextNeutralInfo>de </Typo.ButtonTextNeutralInfo>
      <ButtonTertiaryBlack
        wording={artists}
        icon={ArrowNext}
        inline
        buttonHeight="extraSmall"
        accessibilityLabel={`Accéder à la page de ${artists}`}
        iconPosition="right"
        onPress={showModal}
      />
    </FakeDoorContainer>
  ) : (
    <ArtistsText
      allowFontScaling={false}
      numberOfLines={numberOfLines}
      {...getHeadingAttrs(1)}
      {...accessibilityAndTestId(`Nom de l’artiste\u00a0: ${artists}`)}>
      de {artists}
    </ArtistsText>
  )
}

const ArtistsText = styled(Typo.Title4)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const FakeDoorContainer = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
})
