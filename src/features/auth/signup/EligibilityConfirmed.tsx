import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { ColorsEnum, Spacer, Typo } from 'ui/theme'

export function EligibilityConfirmed() {
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: user } = useUserProfileInfo()

  const shouldNavigateToCulturalSurvey = user?.needsToFillCulturalSurvey

  function goToCulturalSurvey() {
    if (shouldNavigateToCulturalSurvey) {
      navigate('CulturalSurvey')
    } else {
      navigateToHome()
    }
  }

  return (
    <GenericInfoPage title={t`Tu es éligible !`} animation={IlluminatedSmileyAnimation}>
      {!!shouldNavigateToCulturalSurvey && (
        <StyledBody>
          {t`Aide-nous à en savoir plus sur tes pratiques culturelles ! Ta sélection n'aura pas d'impact sur les offres proposées.`}
        </StyledBody>
      )}
      <Spacer.Column numberOfSpaces={15} />
      <ButtonPrimaryWhite title={t`On y va !`} onPress={goToCulturalSurvey} />
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body).attrs({
  color: ColorsEnum.WHITE,
})({
  textAlign: 'center',
})
