import React, { useCallback, useEffect } from 'react'
import styled from 'styled-components/native'

import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { analytics } from 'libs/analytics/provider'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Typo } from 'ui/theme'

export function AccountCreated() {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewAccountCreated)
  }, [])

  const { showShareAppModal } = useShareAppContext()

  const onBeforeNavigate = useCallback(() => {
    BatchProfile.trackEvent(BatchEvent.hasValidatedAccount)
    showShareAppModal(ShareAppModalType.NOT_ELIGIBLE)
    analytics.logAccountCreatedStartClicked()
  }, [showShareAppModal])

  return (
    <GenericInfoPage
      animation={QpiThanks}
      title="Ton compte a été activé&nbsp;!"
      subtitle=""
      buttonPrimary={{
        wording: 'On y va\u00a0!',
        onBeforeNavigate,
        navigateTo: { screen: 'CulturalSurveyIntro' },
      }}>
      <StyledBody>
        Aide-nous à en savoir plus sur tes pratiques culturelles&nbsp;! Ta sélection n’aura pas
        d’impact sur les offres proposées.
      </StyledBody>
    </GenericInfoPage>
  )
}

const StyledBody = styled(Typo.Body)({
  textAlign: 'center',
})
