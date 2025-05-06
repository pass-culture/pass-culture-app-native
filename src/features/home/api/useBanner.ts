import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'

export function useBanner(hasGeolocPosition: boolean) {
  const { isLoggedIn } = useAuthContext()

  return useQuery(
    [QueryKeys.HOME_BANNER, hasGeolocPosition],
    () => api.getNativeV1Banner(hasGeolocPosition),
    {
      enabled: isLoggedIn,
      onError: (error: string) => {
        eventMonitoring.captureException(error)
      },
    }
  )
}
