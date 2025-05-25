import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import { useShouldShowCulturalSurveyForBeneficiaryUser } from 'shared/culturalSurvey/useShouldShowCulturalSurveyForBeneficiaryUser'
import QpiThanks from 'ui/animations/qpi_thanks.json'
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
  }, [showShareAppModal])

  return (
    <GenericInfoPage
      animation={QpiThanks}
      title="Ton compte a été activé&nbsp;!"
      subtitle=""
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        onBeforeNavigate,
        navigateTo: shouldNavigateToCulturalSurvey
          ? { screen: 'CulturalSurveyIntro' }
          : navigateToHomeConfig,
      }}>
      {shouldNavigateToCulturalSurvey ? (
        <StyledBody>
          Aide-nous à en savoir plus sur tes pratiques culturelles&nbsp;! Ta sélection n’aura pas
          d’impact sur les offres proposées.
        </StyledBody>
      ) : null}
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
