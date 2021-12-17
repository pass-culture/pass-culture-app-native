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
  if (subscriptionStep === SubscriptionStep.ProfileCompletion) return IdentityCheckStep.PROFILE
  if (subscriptionStep === SubscriptionStep.IdentityCheck) return IdentityCheckStep.IDENTIFICATION
  if (subscriptionStep === SubscriptionStep.HonorStatement) return IdentityCheckStep.CONFIRMATION
  return null
}

export const useSetCurrentSubscriptionStep = () => {
  const context = useIdentityCheckContext()
  const { refetch } = useNextSubscriptionStep()
  const [subscription, setSubscription] = useState<NextSubscriptionStepResponse | undefined>()

  useFocusEffect(
    useCallback(() => {
      refetch()
        .then(({ data: subscription }) => {
          setSubscription(subscription)
          const nextStep = subscription?.nextSubscriptionStep
          const step = getIdentityCheckStep(nextStep || null)
          if (step) context.dispatch({ type: 'SET_STEP', payload: step })
        })
        .catch(() => {
          eventMonitoring.captureException(new Error('Error fetching subscription'))
        })
    }, [])
  )

  return { subscription }
}
