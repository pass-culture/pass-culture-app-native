import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_REPORT_OFFER_REASONS = 5 * 60 * 1000

export const useReasonsForReporting = () => {
  const { isLoggedIn } = useAuthContext()
  return useQuery(QueryKeys.REPORT_OFFER_REASONS, () => api.getnativev1offerreportreasons(), {
    enabled: isLoggedIn,
    staleTime: STALE_TIME_REPORT_OFFER_REASONS,
    retry: true,
  })
}
