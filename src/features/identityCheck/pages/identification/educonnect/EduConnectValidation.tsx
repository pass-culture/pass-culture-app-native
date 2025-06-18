import { parse, format } from 'date-fns'
import React from 'react'

import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useNavigateForwardToStepper } from 'features/identityCheck/helpers/useNavigateForwardToStepper'
import { useSaveStep } from 'features/identityCheck/pages/helpers/useSaveStep'
import { EduconnectValidationPage } from 'features/identityCheck/pages/identification/educonnect/EduconnectValidationPage'
import { IdentityCheckStep } from 'features/identityCheck/types'

export function EduConnectValidation() {
  const { identification } = useSubscriptionContext()
  const saveStep = useSaveStep()
  const { navigateForwardToStepper } = useNavigateForwardToStepper()

  const birthDate = identification.birthDate
    ? format(parse(identification.birthDate, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy')
    : ''

  const onValidateInformation = async () => {
    await saveStep(IdentityCheckStep.IDENTIFICATION)
    navigateForwardToStepper()
  }

  return (
    <EduconnectValidationPage
      birthDate={birthDate}
      firstName={identification.firstName}
      lastName={identification.lastName}
      onValidate={onValidateInformation}
    />
  )
}
