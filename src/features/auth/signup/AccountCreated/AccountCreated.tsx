import { t } from '@lingui/macro'
import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { useUserProfileInfo } from 'features/profile/api'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { GenericInfoPage } from 'ui/components/GenericInfoPage'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  const { data: user } = useUserProfileInfo()
  const culturalSurveyRoute = useCulturalSurveyRoute()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const trackValidatedAccount = useCallback(
    () => BatchUser.trackEvent(BatchEvent.hasValidatedAccount),
    []
  )

  useEffect(() => {
    if (user?.id)
      campaignTracker.logEvent(CampaignEvents.COMPLETE_REGISTRATION, { af_user_id: user?.id })
  }, [user?.id])

  return (
    <GenericInfoPage
      title={t`Ton compte a été activé\u00a0!`}
      animation={IlluminatedSmileyAnimation}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording={t`On y va\u00a0!`}
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
          onPress={trackValidatedAccount}
        />,
      ]}>
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
