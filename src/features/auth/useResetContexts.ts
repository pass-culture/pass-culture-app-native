import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSearch } from 'features/search/context/SearchWrapper/SearchWrapper'

export const useResetContexts = () => {
  const { dispatch: dispatchSearch } = useSearch()
  const { dispatch: dispatchIdentityCheck } = useSubscriptionContext()

  return () => {
    dispatchSearch({ type: 'INIT' })
    dispatchIdentityCheck({ type: 'INIT' })
  }
}
