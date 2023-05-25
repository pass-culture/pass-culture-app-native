import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { invalidateStepperInfoQuery } from 'features/identityCheck/pages/helpers/invalidateStepperQuery'
import { IdentityCheckStep } from 'features/identityCheck/types'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'

export const useSaveStep = () => {
  const { dispatch } = useSubscriptionContext()

  return async (step: IdentityCheckStep) => {
    await queryClient.invalidateQueries([QueryKeys.NEXT_SUBSCRIPTION_STEP])
    await invalidateStepperInfoQuery()
    dispatch({ type: 'SET_STEP', payload: step })
  }
}
