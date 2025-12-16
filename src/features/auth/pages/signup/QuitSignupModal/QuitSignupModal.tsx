import React, { FunctionComponent, useCallback } from 'react'

import { SignupStep } from 'features/auth/enums'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { analytics } from 'libs/analytics/provider'
import { AppFullPageModal } from 'ui/components/modals/AppFullPageModal'

interface Props {
  signupStep: SignupStep
  testIdSuffix?: string
  resume: () => void
  visible: boolean
}

export const QuitSignupModal: FunctionComponent<Props> = ({
  resume,
  signupStep,
  visible,
  testIdSuffix,
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
    <AppFullPageModal
      visible={visible}
      testIdSuffix={testIdSuffix}
      continueWording="Continuer l’inscription"
      quitWording="Abandonner l’inscription"
      title="Veux-tu abandonner l’inscription&nbsp;?"
      subtitle="Les informations que tu as renseignées ne seront pas enregistrées."
      continueProcess={continueSignup}
      quitProcess={quitSignup}
    />
  )
}
