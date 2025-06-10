import React, { FunctionComponent, useCallback } from 'react'

import { SignupStep } from 'features/auth/enums'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { Clear } from 'ui/svg/icons/Clear'
import { ErrorIllustration } from 'ui/svg/icons/ErrorIllustration'

interface Props {
  visible: boolean
  signupStep: SignupStep
  resume: () => void
  testIdSuffix?: string
}

export const QuitSignupModal: FunctionComponent<Props> = ({
  visible,
  resume,
  testIdSuffix,
  signupStep,
}) => {
  const quitSignup = useCallback(() => {
    analytics.logCancelSignup(signupStep)
    resume()
    navigateToHome()
  }, [resume, signupStep])

  const continueSignup = useCallback(() => {
    analytics.logContinueSignup()
    resume()
  }, [resume])

  return (
    <AppFullPageModal visible={visible} testIdSuffix={testIdSuffix} onRequestClose={continueSignup}>
      <GenericInfoPage
        illustration={ErrorIllustration}
        title="Veux-tu abandonner l’inscription&nbsp;?"
        subtitle="Les informations que tu as renseignées ne seront pas enregistrées."
        buttonPrimary={{
          wording: 'Continuer l’inscription',
          onPress: continueSignup,
        }}
        buttonTertiary={{
          wording: 'Abandonner l’inscription',
          onPress: quitSignup,
          icon: Clear,
        }}
      />
    </AppFullPageModal>
  )
}
