import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { UseNavigationType } from 'features/navigation/RootNavigator'
import { _ } from 'libs/i18n'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function EligibilityConfirmed() {
  const { navigate } = useNavigation<UseNavigationType>()

  function goToCulturalSurvey() {
    navigate('CulturalSurvey')
  }

  return (
    <GenericInfoPage title={_(t`Tu es éligible !`)} animation={IlluminatedSmileyAnimation}>
      <StyledBody>
        {_(
          t`Aide-nous à en savoir plus sur tes pratiques culturelles !
          Ta sélection n'aura pas d'impact sur les offres proposées.`
        )}
      </StyledBody>
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimaryWhite title={_(t`On y va !`)} onPress={goToCulturalSurvey} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
