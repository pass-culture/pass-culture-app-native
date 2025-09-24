import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { invalidateStepperInfoQueries } from 'features/identityCheck/pages/helpers/invalidateStepperQueries'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

export const useSaveStep = () => {
  const { dispatch } = useSubscriptionContext()

  return async (step: IdentityCheckStep) => {
    await queryClient.invalidateQueries({ queryKey: [QueryKeys.NEXT_SUBSCRIPTION_STEP] })
    await invalidateStepperInfoQueries()
    dispatch({ type: 'SET_STEP', payload: step })
  }
}
