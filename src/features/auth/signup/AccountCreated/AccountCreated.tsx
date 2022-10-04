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
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
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
      title="Ton compte a été activé&nbsp;!"
      animation={IlluminatedSmileyAnimation}
      buttons={[
        <TouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="On y va&nbsp;!"
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
          onPress={trackValidatedAccount}
        />,
      ]}>
      {!!shouldNavigateToCulturalSurvey && (
        <StyledBody>
          Aide-nous à en savoir plus sur tes pratiques culturelles&nbsp;! Ta sélection n’aura pas
          d’impact sur les offres proposées.
        </StyledBody>
      )}
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
