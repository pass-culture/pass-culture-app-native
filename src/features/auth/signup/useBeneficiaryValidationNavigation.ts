import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { NextSubscriptionStepResponse, SubscriptionStep, MaintenancePageType } from 'api/gen'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useSetIdCheckNavigationContext } from 'features/navigation/useSetIdCheckNavigationContext'
import { UserProfilingError } from 'libs/monitoring/errors'

export const useBeneficiaryValidationNavigation = (setError: (error: Error) => void) => {
  useSetIdCheckNavigationContext()
  const navigateToNextStep = useNavigateToNextSubscriptionStep(setError)

  const navigateToNextBeneficiaryValidationStep = useCallback(() => {
    return api.getnativev1subscriptionnextStep().then(navigateToNextStep).catch(setError)
  }, [navigateToNextStep])

  return { navigateToNextBeneficiaryValidationStep }
}

const useNavigateToNextSubscriptionStep = (setError: (error: Error) => void) => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (nextSubscriptionStep: NextSubscriptionStepResponse) => {
    const { nextSubscriptionStep: nextStep, maintenancePageType } = nextSubscriptionStep

    if (nextStep === SubscriptionStep.PhoneValidation) {
      return navigate('SetPhoneNumber')
    } else if (nextStep === SubscriptionStep.Maintenance) {
      const shouldEnableDMS = maintenancePageType === MaintenancePageType.WithDms
      return navigate('IdentityCheckUnavailable', { withDMS: shouldEnableDMS })
    } else if (
      nextStep === SubscriptionStep.IdentityCheck ||
      nextStep === SubscriptionStep.ProfileCompletion ||
      nextStep === SubscriptionStep.HonorStatement
    ) {
      return navigate('IdentityCheckStepper')
    } else if (nextStep === SubscriptionStep.UserProfiling) {
      setError(new UserProfilingError('SubscriptionStep.UserProfiling', UserProfiling))
    }
    return navigateToHome()
  }
}
