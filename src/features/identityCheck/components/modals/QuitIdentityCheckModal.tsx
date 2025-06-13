import React, { FunctionComponent } from 'react'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'

interface Props {
  visible: boolean
  hideModal: () => void
  testIdSuffix?: string
}

export const QuitIdentityCheckModal: FunctionComponent<Props> = ({
  visible,
  hideModal,
  testIdSuffix,
}) => {
  const context = useSubscriptionContext()

  function quitIdentityCheck() {
    if (context.step) analytics.logQuitIdentityCheck(context.step)
    hideModal()
    navigateToHome()
  }

  function continueIdentityCheck() {
    analytics.logContinueIdentityCheck()
    hideModal()
  }

  return (
    <AppFullPageModal
      visible={visible}
      testIdSuffix={testIdSuffix}
      onRequestClose={continueIdentityCheck}>
      <GenericInfoPage
        illustration={ErrorIllustration}
        title="Veux-tu abandonner la vérification d’identité&nbsp;?"
        subtitle="Les informations que tu as renseignées ne seront pas enregistrées."
        buttonPrimary={{
          wording: 'Continuer la vérification',
          onPress: continueIdentityCheck,
        }}
        buttonTertiary={{
          wording: 'Abandonner la vérification',
          onPress: quitIdentityCheck,
          icon: Clear,
        }}
      />
    </AppFullPageModal>
  )
}
