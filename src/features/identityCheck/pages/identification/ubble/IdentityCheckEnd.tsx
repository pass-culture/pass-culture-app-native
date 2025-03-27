import React, { FC, useEffect } from 'react'

import { useGetStepperInfo } from 'features/identityCheck/api/useGetStepperInfo'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { navigateToHome } from 'features/navigation/helpers/navigateToHome'
import { GenericInfoPageDeprecated } from 'ui/pages/GenericInfoPageDeprecated'
import { EmailSent } from 'ui/svg/icons/EmailSent'

export const IdentityCheckEnd: FC = () => {
  const { data: subscription } = useGetStepperInfo()

  const { navigateForwardToStepper } = useNavigateForwardToStepper()
  const saveStep = useSaveStep()

  const navigateToStepper = async () => {
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigateForwardToStepper()
  }

  useEffect(() => {
    const timeout = setTimeout(
      subscription?.nextSubscriptionStep ? navigateToStepper : navigateToHome,
      3000
    )
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscription?.nextSubscriptionStep])

  return (
    <GenericInfoPageDeprecated
      title="Ta pièce d’identité a bien été transmise&nbsp;!"
      icon={EmailSent}
    />
  )
}
