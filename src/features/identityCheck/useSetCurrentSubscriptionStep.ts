import { useFocusEffect } from '@react-navigation/native'
import { useCallback, useState } from 'react'

import { NextSubscriptionStepResponse, SubscriptionStep } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { eventMonitoring } from 'libs/monitoring'

const getIdentityCheckStep = (
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
  const context = useIdentityCheckContext()
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
    }, [])
  )

  return { subscription }
}
