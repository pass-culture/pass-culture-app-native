import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { invalidateStepperInfoQueries } from 'features/identityCheck/pages/helpers/invalidateStepperQueries'
import { IdentityCheckStep } from 'features/identityCheck/types'

export const useSaveStep = () => {
  const { dispatch } = useSubscriptionContext()

  return async (step: IdentityCheckStep) => {
    await invalidateStepperInfoQueries()
    dispatch({ type: 'SET_STEP', payload: step })
  }
}
