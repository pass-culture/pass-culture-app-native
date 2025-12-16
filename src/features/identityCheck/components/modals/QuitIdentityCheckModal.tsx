import React, { FunctionComponent } from 'react'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'

interface Props {
  visible: boolean
  testIdSuffix?: string
  hideModal: () => void
}

export const QuitIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  testIdSuffix,
}) => {
  const context = useSubscriptionContext()

  const quitIdentityCheck = () => {
    if (context.step) analytics.logQuitIdentityCheck(context.step)
    hideModal()
    navigateToHome()
  }

  const continueIdentityCheck = () => {
    analytics.logContinueIdentityCheck()
    hideModal()
  }

  return (
    <AppFullPageModal
      visible={visible}
      testIdSuffix={testIdSuffix}
      continueWording="Continuer la vérification"
      quitWording="Abandonner la vérification"
      title="Veux-tu abandonner la vérification d’identité&nbsp;?"
      subtitle="Les informations que tu as renseignées ne seront pas enregistrées."
      continueProcess={continueIdentityCheck}
      quitProcess={quitIdentityCheck}
    />
  )
}
