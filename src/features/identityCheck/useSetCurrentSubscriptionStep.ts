import { useFocusEffect } from '@react-navigation/native'
import { useCallback } from 'react'

import { SubscriptionStep } from 'api/gen'
import { useNextSubscriptionStep } from 'features/auth/signup/nextSubscriptionStep'
import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { eventMonitoring } from 'libs/monitoring'

const getIdentityCheckStep = (subscriptionStep: SubscriptionStep | null): IdentityCheckStep => {
  if (subscriptionStep === SubscriptionStep.ProfileCompletion) return IdentityCheckStep.PROFILE
  if (subscriptionStep === SubscriptionStep.IdentityCheck) return IdentityCheckStep.IDENTIFICATION
  return IdentityCheckStep.CONFIRMATION
}

export const useSetCurrentSubscriptionStep = () => {
  const context = useIdentityCheckContext()
  const { refetch } = useNextSubscriptionStep()

  useFocusEffect(
    useCallback(() => {
      refetch()
        .then(({ data: subscription }) => {
          const step = getIdentityCheckStep(subscription?.nextSubscriptionStep || null)
          context.dispatch({ type: 'SET_STEP', payload: step })
        })
        .catch(() => {
          eventMonitoring.captureException(new Error('Error fetching subscription'))
        })
    }, [])
  )
}
