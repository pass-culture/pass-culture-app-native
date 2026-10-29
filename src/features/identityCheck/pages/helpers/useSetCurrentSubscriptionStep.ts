import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { SubscriptionStep, SubscriptionStepperResponseV3 } from 'api/gen'
import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useGetStepperInfoQuery } from 'features/identityCheck/queries/useGetStepperInfoQuery'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { eventMonitoring } from 'libs/monitoring/services'

export const getIdentityCheckStep = (
  subscriptionStep: SubscriptionStep | null
): IdentityCheckStep | null => {
  if (subscriptionStep === SubscriptionStep['profile-completion']) return IdentityCheckStep.PROFILE
  if (subscriptionStep === SubscriptionStep['identity-check'])
    return IdentityCheckStep.IDENTIFICATION
  if (subscriptionStep === SubscriptionStep['honor-statement'])
    return IdentityCheckStep.CONFIRMATION
  return null
}

export const useSetSubscriptionStepAndMethod = () => {
  const context = useSubscriptionContext()
  const { refetch } = useGetStepperInfoQuery()
  const [subscription, setSubscription] = useState<SubscriptionStepperResponseV3 | undefined>()

  const setCurrentStep = (susbcriptionResponse: SubscriptionStepperResponseV3 | undefined) => {
    setSubscription(susbcriptionResponse)
    const nextStep = susbcriptionResponse?.nextSubscriptionStep
    const step = getIdentityCheckStep(nextStep ?? null)
    if (step) context.dispatch({ type: 'SET_STEP', payload: step })
  }

  const setCurrentIdentityCheckMethod = (
    susbcriptionResponse: SubscriptionStepperResponseV3 | undefined
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
