import React, { FC, useEffect } from 'react'

import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPage } from 'ui/pages/GenericInfoPage'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd: FC = () => {
  const { data: subscription } = useGetStepperInfo()

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()

  const navigateToStepperWithReload = async () => {
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigateForwardToStepper()
    setTimeout(() => window.location.reload(), 100)
  }

  const navigateHomeWithReload = () => {
    navigateToHome()
    setTimeout(() => window.location.reload(), 100)
  }

  useEffect(() => {
    const timeout = setTimeout(
      subscription?.nextSubscriptionStep ? navigateToStepperWithReload : navigateHomeWithReload,
      3000
    )
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription?.nextSubscriptionStep])

  return (
    <GenericInfoPage title="Ta pièce d’identité a bien été transmise&nbsp;!" icon={EmailSent} />
  )
}
