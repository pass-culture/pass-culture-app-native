import { useQuery } from 'react-query'

import { api } from 'api/api'
import { UserReportedOffersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { useNetwork } from 'libs/network/useNetwork'
import { QueryKeys } from 'libs/queryKeys'

export const useReportedOffers = () => {
  const { isConnected } = useNetwork()
  const { isLoggedIn } = useAuthContext()

  return useQuery<UserReportedOffersResponse>(
    QueryKeys.REPORTED_OFFERS,
    () => api.getnativev1offersreports(),
    {
      enabled: isLoggedIn && isConnected,
      retry: true,
    }
  )
}
