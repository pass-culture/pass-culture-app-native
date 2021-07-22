import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useReasonsForReporting = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery(QueryKeys.REPORT_OFFER_REASONS, () => api.getnativev1offerreportreasons(), {
    enabled: isLoggedIn,
  })
}
