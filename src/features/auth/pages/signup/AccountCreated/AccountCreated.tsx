import React, { useCallback } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/helpers/shareAppModalInformations'
import { analytics } from 'libs/analytics'
import { BatchEvent, BatchUser } from 'libs/react-native-batch'
import { shouldShowCulturalSurvey } from 'shared/culturalSurvey/shouldShowCulturalSurvey'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  const { user } = useAuthContext()
  const { showShareAppModal } = useShareAppContext()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const onBeforeNavigate = useCallback(() => {
    BatchUser.trackEvent(BatchEvent.hasValidatedAccount)
    showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)
    analytics.logAccountCreatedStartClicked()
  }, [showShareAppModal])

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
            shouldNavigateToCulturalSurvey
              ? { screen: 'CulturalSurveyIntro' }
              : navigateToHomeConfig
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
