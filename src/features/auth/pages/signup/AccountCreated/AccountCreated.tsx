import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'
import IlluminatedSmileyAnimation from 'ui/animations/lottie_illuminated_smiley.json'
import { ButtonPrimaryWhite } from 'ui/components/buttons/ButtonPrimaryWhite'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewAccountCreated)
  }, [])

  const { user } = useAuthContext()
  const { showShareAppModal } = useShareAppContext()
  const shouldShowCulturalSurvey = useShouldShowCulturalSurveyForBeneficiaryUser()

  const shouldNavigateToCulturalSurvey = shouldShowCulturalSurvey(user)

  const onBeforeNavigate = useCallback(() => {
    BatchProfile.trackEvent(BatchEvent.hasValidatedAccount)
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
      {shouldNavigateToCulturalSurvey ? (
        <StyledBody>
          Aide-nous à en savoir plus sur tes pratiques culturelles&nbsp;! Ta sélection n’aura pas
          d’impact sur les offres proposées.
        </StyledBody>
      ) : null}
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.white,
  textAlign: 'center',
}))
