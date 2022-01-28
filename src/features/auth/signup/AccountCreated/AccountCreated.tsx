import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import styled from 'styled-components/native'

import { shouldShowCulturalSurvey } from 'features/firstLogin/helpers'
import { useUserProfileInfo } from 'features/home/api'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  const { data: user } = useUserProfileInfo()
  const { navigate } = useNavigation<UseNavigationType>()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  function onPress() {
    if (shouldNavigateToCulturalSurvey) {
      navigate('CulturalSurvey')
    } else {
      navigateToHome()
    }
  }

  useEffect(() => {
    if (user?.id)
      campaignTracker.logEvent(CampaignEvents.COMPLETE_REGISTRATION, { af_user_id: user?.id })
  }, [user?.id])

  return (
    <GenericInfoPage
      title={t`Ton compte a été activé\u00a0!`}
      animation={IlluminatedSmileyAnimation}
      buttons={[<ButtonPrimaryWhite key={1} wording={t`On y va\u00a0!`} onPress={onPress} />]}>
      {!!shouldNavigateToCulturalSurvey && (
        <StyledBody>
          {t`Aide-nous à en savoir plus sur tes pratiques culturelles\u00a0! Ta sélection n'aura pas d'impact sur les offres proposées.`}
        </StyledBody>
      )}
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
