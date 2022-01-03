import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { api } from 'api/api'
import { NextSubscriptionStepResponse, SubscriptionStep, MaintenancePageType } from 'api/gen'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { UserProfilingError } from 'libs/monitoring/errors'

export const useBeneficiaryValidationNavigation = (setError: (error: Error) => void) => {
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
    if (nextStep === SubscriptionStep['phone-validation']) {
      navigate('SetPhoneNumber')
    } else if (nextStep === SubscriptionStep.maintenance) {
      navigate('IdentityCheckUnavailable', {
        withDMS: maintenancePageType === MaintenancePageType['with-dms'],
      })
    } else if (
      nextStep === SubscriptionStep['identity-check'] ||
      nextStep === SubscriptionStep['profile-completion'] ||
      nextStep === SubscriptionStep['honor-statement']
    ) {
      navigate('IdentityCheckStepper')
    } else if (nextStep === SubscriptionStep['user-profiling']) {
      setError(new UserProfilingError("SubscriptionStep['user-profiling']", UserProfiling))
    } else {
      navigateToHome()
    }
  }
}
