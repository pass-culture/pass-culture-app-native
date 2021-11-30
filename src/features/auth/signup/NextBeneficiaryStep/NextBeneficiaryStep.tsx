import { useFocusEffect } from '@react-navigation/native'
import React from 'react'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { LoadingPage } from 'ui/components/LoadingPage'

export function NextBeneficiaryStep() {
  const { navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()
  useFocusEffect(() => {
    navigateToNextBeneficiaryValidationStep()
  })

  return <LoadingPage />
}
