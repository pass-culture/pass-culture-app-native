import { useQuery } from 'react-query'

import { api } from 'api/api'
import { UserReportedOffersResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

const STALE_TIME_REPORTED_OFFERS = 5 * 60 * 1000

export const useReportedOffers = () => {
  const { isLoggedIn } = useAuthContext()

  return useQuery<UserReportedOffersResponse>(
    QueryKeys.REPORTED_OFFERS,
    () => api.getnativev1offersreports(),
    { enabled: isLoggedIn, staleTime: STALE_TIME_REPORTED_OFFERS, retry: true }
  )
}
