import { useNavigation } from '@react-navigation/native'
import { useCallback } from 'react'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { NextSubscriptionStepResponse, SubscriptionStep, MaintenancePageType } from 'api/gen'
import { UserProfiling } from 'features/auth/signup/UserProfiling'
import { navigateToHome } from 'features/navigation/helpers'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { homeNavConfig } from 'features/navigation/TabBar/helpers'
import { UserProfilingError } from 'libs/monitoring/errors'
import { QueryKeys } from 'libs/queryKeys'
import { TouchableLinkProps } from 'ui/components/touchableLink/types'

type NextStepNavConfig = TouchableLinkProps['navigateTo']

export const useNextSubscriptionStep = (setError: (error: Error) => void) =>
  useQuery<NextSubscriptionStepResponse | undefined>(
    [QueryKeys.NEXT_SUBSCRIPTION_STEP],
    async () => {
      try {
        return await api.getnativev1subscriptionnextStep()
      } catch (e) {
        e instanceof Error && setError(e)
        return undefined
      }
    }
  )

export const useBeneficiaryValidationNavigation = (setError: (error: Error) => void) => {
  const navigateToNextStep = useNavigateToNextSubscriptionStep(setError)
  const { data: nextSubscriptionStep, refetch } = useNextSubscriptionStep(setError)
  let nextStepNavConfig = nextSubscriptionStep
    ? getNavConfigForNextSubscriptionStep(nextSubscriptionStep)
    : undefined

  const beforeNavigateToNextStep = () => {
    beforeNavigateToNextSubscriptionStep(setError, nextStepNavConfig)
  }

  const navigateToNextBeneficiaryValidationStep = useCallback(async () => {
    const { data } = await refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    nextStepNavConfig = data && getNavConfigForNextSubscriptionStep(data)
    return navigateToNextStep(nextStepNavConfig)
  }, [navigateToNextStep])

  return {
    nextBeneficiaryValidationStepNavConfig: nextStepNavConfig,
    beforeNavigateToNextSubscriptionStep: beforeNavigateToNextStep,
    navigateToNextBeneficiaryValidationStep,
  }
}

const getNavConfigForNextSubscriptionStep = (
  nextSubscriptionStep: NextSubscriptionStepResponse
): NextStepNavConfig => {
  const {
    nextSubscriptionStep: nextStep,
    maintenancePageType,
    stepperIncludesPhoneValidation,
  } = nextSubscriptionStep
  if (!stepperIncludesPhoneValidation && nextStep === SubscriptionStep['phone-validation']) {
    return { screen: 'SetPhoneNumber' }
  } else if (nextStep === SubscriptionStep.maintenance) {
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
  } else if (nextStep === SubscriptionStep['user-profiling']) {
    return undefined
  } else {
    return { screen: homeNavConfig[0], params: homeNavConfig[1], fromRef: true }
  }
}

const beforeNavigateToNextSubscriptionStep = (
  setError: (error: Error) => void,
  navConfig: NextStepNavConfig
) => {
  if (!navConfig) {
    setError(new UserProfilingError("SubscriptionStep['user-profiling']", UserProfiling))
  }
}

const useNavigateToNextSubscriptionStep = (setError: (error: Error) => void) => {
  const { navigate } = useNavigation<UseNavigationType>()

  return (navConfig: NextStepNavConfig) => {
    if (!navConfig) {
      beforeNavigateToNextSubscriptionStep(setError, navConfig)
    } else {
      const { screen, params } = navConfig
      screen === homeNavConfig[0] ? navigateToHome() : navigate(screen, params)
    }
  }
}
