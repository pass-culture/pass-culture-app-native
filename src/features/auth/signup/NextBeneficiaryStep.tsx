import { useFocusEffect } from '@react-navigation/native'
import React from 'react'

import { useBeneficiaryValidationNavigation } from 'features/auth/signup/useBeneficiaryValidationNavigation'
import { LoadingPage } from 'ui/components/LoadingPage'

export function NextBeneficiaryStep() {
  const { error, navigateToNextBeneficiaryValidationStep } = useBeneficiaryValidationNavigation()
  useFocusEffect(navigateToNextBeneficiaryValidationStep)

  if (error) {
    throw error
  }

  return <LoadingPage />
}
