import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { SubscriptionStep, SubscriptionStepperResponseV2 } from 'api/gen'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { DeprecatedIdentityCheckStep } from 'features/identityCheck/types'
import { eventMonitoring } from 'libs/monitoring/services'

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
  const { refetch } = useGetStepperInfoQuery()
  const [subscription, setSubscription] = useState<SubscriptionStepperResponseV2 | undefined>()

  const setCurrentStep = (susbcriptionResponse: SubscriptionStepperResponseV2 | undefined) => {
    setSubscription(susbcriptionResponse)
    const nextStep = susbcriptionResponse?.nextSubscriptionStep
    const step = getIdentityCheckStep(nextStep ?? null)
    if (step) context.dispatch({ type: 'SET_STEP', payload: step })
  }

  const setCurrentIdentityCheckMethod = (
    susbcriptionResponse: SubscriptionStepperResponseV2 | undefined
  ) => {
    const identityCheckMethods = susbcriptionResponse?.allowedIdentityCheckMethods
    const method = identityCheckMethods?.length === 1 ? identityCheckMethods[0] : null
    // @ts-expect-error: because of noUncheckedIndexedAccess
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
