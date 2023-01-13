import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'

import { NextSubscriptionStepResponse, SubscriptionStep, MaintenancePageType } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/helpers/useNextSubscriptionStep'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator/types'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'

type NextStepNavConfig = InternalNavigationProps['navigateTo'] | undefined

export const useBeneficiaryValidationNavigation = (setError?: (error: Error) => void) => {
  const navigateToNextStep = useNavigateToNextSubscriptionStep()
  const { data: nextSubscriptionStep, refetch } = useNextSubscriptionStep(setError)
  let nextStepNavConfig = nextSubscriptionStep
    ? getNavConfigForNextSubscriptionStep(nextSubscriptionStep)
    : undefined

  const navigateToNextBeneficiaryValidationStep = useCallback(async () => {
    const { data } = await refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    nextStepNavConfig = data && getNavConfigForNextSubscriptionStep(data)
    return navigateToNextStep(nextStepNavConfig)
  }, [navigateToNextStep])

  return {
    nextBeneficiaryValidationStepNavConfig: nextStepNavConfig,
    navigateToNextBeneficiaryValidationStep,
  }
}

const getNavConfigForNextSubscriptionStep = (
  nextSubscriptionStep: NextSubscriptionStepResponse
): NextStepNavConfig => {
  const { nextSubscriptionStep: nextStep, maintenancePageType } = nextSubscriptionStep
  if (nextStep === SubscriptionStep.maintenance) {
    return {
      screen: 'IdentityCheckUnavailable',
      params: {
        withDMS: maintenancePageType === MaintenancePageType['with-dms'],
      },
    }
  } else if (
    nextStep === SubscriptionStep['phone-validation'] ||
    nextStep === SubscriptionStep['identity-check'] ||
    nextStep === SubscriptionStep['profile-completion'] ||
    nextStep === SubscriptionStep['honor-statement']
  ) {
    return { screen: 'IdentityCheckStepper' }
  } else {
    return { screen: homeNavConfig[0], params: homeNavConfig[1], fromRef: true }
  }
}

const useNavigateToNextSubscriptionStep = () => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (navConfig: NextStepNavConfig) => {
    if (!navConfig) {
      navigateToHome()
    } else {
      const { screen, params } = navConfig
      screen === homeNavConfig[0] ? navigateToHome() : navigate(screen, params)
    }
  }
}
