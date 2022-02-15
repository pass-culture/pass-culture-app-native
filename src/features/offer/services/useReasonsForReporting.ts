import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

export const useReasonsForReporting = () => {
  const { isConnected } = useNetwork()
  const { isLoggedIn } = useAuthContext()

  return useQuery(QueryKeys.REPORT_OFFER_REASONS, () => api.getnativev1offerreportreasons(), {
    enabled: isLoggedIn && isConnected,
    retry: true,
  })
}
