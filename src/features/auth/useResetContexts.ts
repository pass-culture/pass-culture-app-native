import { useIdentityCheckContext } from 'features/identityCheck/context/IdentityCheckContextProvider'
import { useSearch, useStagedSearch } from 'features/search/pages/SearchWrapper'

export const useResetContexts = () => {
  const { dispatch: dispatchSearch } = useSearch()
  const { dispatch: dispatchStagedSearch } = useStagedSearch()
  const { dispatch: dispatchIdentityCheck } = useIdentityCheckContext()

  return () => {
    dispatchSearch({ type: 'INIT' })
    dispatchStagedSearch({ type: 'INIT' })
    dispatchIdentityCheck({ type: 'INIT' })
  }
}
