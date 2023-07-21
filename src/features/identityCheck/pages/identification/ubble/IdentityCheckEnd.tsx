import React, { useEffect } from 'react'

import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { navigateToHome } from 'features/navigation/helpers'
import { analytics } from 'libs/analytics'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd = () => {
  const { data: subscription } = useNextSubscriptionStep()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()

  const navigateToStepper = async () => {
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigateForwardToStepper()
  }

  useEffect(() => {
    analytics.logScreenViewIdentityCheckEnd()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(
      !subscription?.nextSubscriptionStep ? navigateToHome : navigateToStepper,
      3000
    )
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription?.nextSubscriptionStep])

  return (
    <GenericInfoPage title="Ta pièce d’identité a bien été transmise&nbsp;!" icon={EmailSent} />
  )
}
