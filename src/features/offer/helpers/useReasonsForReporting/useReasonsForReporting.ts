import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_REPORT_OFFER_REASONS = 5 * 60 * 1000

export const useReasonsForReporting = () => {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()
  return useQuery(QueryKeys.REPORT_OFFER_REASONS, () => api.getnativev1offerreportreasons(), {
    enabled: !!netInfo.isConnected && isLoggedIn,
    staleTime: STALE_TIME_REPORT_OFFER_REASONS,
    retry: true,
  })
}
