import { useSubscriptionContext } from 'features/identityCheck/context/SubscriptionContextProvider'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'

export const useResetContexts = () => {
  const { dispatch: dispatchSearch } = useSearch()
  const { dispatch: dispatchStagedSearch } = useStagedSearch()
  const { dispatch: dispatchIdentityCheck } = useSubscriptionContext()

  return () => {
    dispatchSearch({ type: 'INIT' })
    dispatchStagedSearch({ type: 'INIT' })
    dispatchIdentityCheck({ type: 'INIT' })
  }
}
