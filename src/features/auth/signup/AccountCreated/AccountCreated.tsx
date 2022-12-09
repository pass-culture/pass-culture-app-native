import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/AuthContext'
import {
  shouldShowCulturalSurvey,
  useCulturalSurveyRoute,
} from 'features/culturalSurvey/helpers/utils'
import { navigateToHomeConfig } from 'features/navigation/helpers'
import { useShareAppContext } from 'features/shareApp/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/shareApp/helpers/shareAppModalInformations'
import { campaignTracker, CampaignEvents } from 'libs/campaign'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  const { user } = useAuthContext()
  const culturalSurveyRoute = useCulturalSurveyRoute()
  const { showShareAppModal } = useShareAppContext()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const onBeforeNavigate = useCallback(() => {
    BatchUser.trackEvent(BatchEvent.hasValidatedAccount)
    showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)
  }, [showShareAppModal])

  useEffect(() => {
    if (user?.id)
      campaignTracker.logEvent(CampaignEvents.COMPLETE_REGISTRATION, { af_user_id: user?.id })
  }, [user?.id])

  return (
    <GenericInfoPage
      title="Ton compte a été activé&nbsp;!"
      animation={IlluminatedSmileyAnimation}
      buttons={[
        <InternalTouchableLink
          key={1}
          as={ButtonPrimaryWhite}
          wording="On y va&nbsp;!"
          navigateTo={
            shouldNavigateToCulturalSurvey ? { screen: culturalSurveyRoute } : navigateToHomeConfig
          }
          onBeforeNavigate={onBeforeNavigate}
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
