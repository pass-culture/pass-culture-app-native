import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/api/useNextSubscriptionStep'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'
import { eventMonitoring } from 'libs/monitoring'

export const getIdentityCheckStep = (
  subscriptionStep: SubscriptionStep | null
): DeprecatedIdentityCheckStep | null => {
  if (subscriptionStep === SubscriptionStep['phone-validation'])
    return DeprecatedIdentityCheckStep.PHONE_VALIDATION
  if (subscriptionStep === SubscriptionStep['profile-completion'])
    return DeprecatedIdentityCheckStep.PROFILE
  if (subscriptionStep === SubscriptionStep['identity-check'])
    return DeprecatedIdentityCheckStep.IDENTIFICATION
  if (subscriptionStep === SubscriptionStep['honor-statement'])
    return DeprecatedIdentityCheckStep.CONFIRMATION
  return null
}

export const useSetSubscriptionStepAndMethod = () => {
  const context = useSubscriptionContext()
  const { refetch } = useNextSubscriptionStep()
  const [subscription, setSubscription] = useState<NextSubscriptionStepResponse | undefined>()

  const setCurrentStep = (susbcriptionResponse: NextSubscriptionStepResponse | undefined) => {
    setSubscription(susbcriptionResponse)
    const nextStep = susbcriptionResponse?.nextSubscriptionStep
    const step = getIdentityCheckStep(nextStep || null)
    if (step) context.dispatch({ type: 'SET_STEP', payload: step })
  }

  const setCurrentIdentityCheckMethod = (
    susbcriptionResponse: NextSubscriptionStepResponse | undefined
  ) => {
    const identityCheckMethods = susbcriptionResponse?.allowedIdentityCheckMethods
    const method = identityCheckMethods?.length === 1 ? identityCheckMethods[0] : null
    context.dispatch({ type: 'SET_METHOD', payload: method })
  }

  useFocusEffect(
    useCallback(() => {
      refetch()
        .then(({ data: subscriptionStep }) => {
          setCurrentStep(subscriptionStep)
          setCurrentIdentityCheckMethod(subscriptionStep)
        })
        .catch(() => {
          eventMonitoring.captureException(new Error('Error fetching subscription'))
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  return { subscription }
}
