import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { UserReportedOffersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useReportedOffers = () => {
  const networkInfo = useNetInfo()
  const { isLoggedIn } = useAuthContext()

  return useQuery<UserReportedOffersResponse>(
    QueryKeys.REPORTED_OFFERS,
    () => api.getnativev1offersreports(),
    {
      enabled: isLoggedIn && networkInfo.isConnected,
      retry: true,
    }
  )
}
