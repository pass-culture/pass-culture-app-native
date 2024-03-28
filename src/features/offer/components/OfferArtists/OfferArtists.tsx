import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { FakeDoorModal } from 'ui/components/modals/FakeDoorModal'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { Spacer, Typo } from 'ui/theme'
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
  const { visible, showModal, hideModal } = useModal()

  const handleOnPress = () => {
    analytics.logConsultArtistFakeDoor()
    showModal()
  }

  return shouldDisplayFakeDoor ? (
    <FakeDoorContainer>
      <Typo.ButtonTextNeutralInfo>de</Typo.ButtonTextNeutralInfo>
      <Spacer.Row numberOfSpaces={2} />
      <ButtonTertiaryBlack
        wording={artists}
        icon={ArrowNext}
        inline
        buttonHeight="extraSmall"
        accessibilityLabel={`Accéder à la page de ${artists}`}
        iconPosition="right"
        onPress={handleOnPress}
      />
      <FakeDoorModal
        visible={visible}
        hideModal={hideModal}
        surveyUrl="https://passculture.qualtrics.com/jfe/form/SV_6xRze4sgvlbHNd4"
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
