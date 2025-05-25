import React, { useCallback, useEffect } from 'react'

import { navigateToHomeConfig } from 'features/navigation/helpers/navigateToHome'
import { useShareAppContext } from 'features/share/context/ShareAppWrapper'
import { ShareAppModalType } from 'features/share/types'
import { BatchEvent, BatchProfile } from 'libs/react-native-batch'
import QpiThanks from 'ui/animations/qpi_thanks.json'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'

export function AccountCreated() {
  useEffect(() => {
    BatchProfile.trackEvent(BatchEvent.screenViewAccountCreated)
  }, [])

  const { showShareAppModal } = useShareAppContext()

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
        navigateTo: navigateToHomeConfig,
      }}></GenericInfoPage>
  )
}
