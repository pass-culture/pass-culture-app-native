import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { analytics } from 'libs/analytics'
import { ButtonTertiaryBlack } from 'ui/components/buttons/ButtonTertiaryBlack'
import { SurveyModal } from 'ui/components/modals/SurveyModal'
import { useModal } from 'ui/components/modals/useModal'
import { ArrowNext } from 'ui/svg/icons/ArrowNext'
import { BicolorCircledClock } from 'ui/svg/icons/BicolorCircledClock'
import { Spacer, Typo } from 'ui/theme'
import { LINE_BREAK } from 'ui/theme/constants'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  artists: string
  numberOfLines?: number
  shouldDisplayFakeDoor?: boolean
}
const fakeDoorArtistModalDescription = `Ce contenu n’est pas encore disponible.${LINE_BREAK}${LINE_BREAK}Aide-nous à le mettre en place en répondant au questionnaire.`

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
      <SurveyModal
        title="Encore un peu de patience…"
        visible={visible}
        hideModal={hideModal}
        surveyUrl="https://passculture.qualtrics.com/jfe/form/SV_6xRze4sgvlbHNd4"
        surveyDescription={fakeDoorArtistModalDescription}
        Icon={BicolorCircledClock}
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
