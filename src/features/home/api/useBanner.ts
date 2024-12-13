import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export function useBanner(hasGeolocPosition: boolean) {
  const { isLoggedIn } = useAuthContext()

  return useQuery(
    [QueryKeys.HOME_BANNER, hasGeolocPosition],
    () => api.getNativeV1Banner(hasGeolocPosition),
    {
      enabled: isLoggedIn,
    }
  )
}
