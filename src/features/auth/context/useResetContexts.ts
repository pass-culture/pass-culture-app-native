import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSearch } from 'features/search/context/SearchWrapper'

export const useResetContexts = () => {
  const { resetSearch } = useSearch()
  const { dispatch: dispatchIdentityCheck } = useSubscriptionContext()

  return () => {
    resetSearch()
    dispatchIdentityCheck({ type: 'INIT' })
  }
}
