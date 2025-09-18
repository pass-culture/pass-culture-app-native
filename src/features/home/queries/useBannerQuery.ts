import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { QueryKeys } from 'libs/queryKeys'

export const useBannerQuery = (hasGeolocPosition: boolean) => {
  const { isLoggedIn } = useAuthContext()

  return useQuery({
    queryKey: [QueryKeys.HOME_BANNER, hasGeolocPosition],
    queryFn: () => api.getNativeV1Banner(hasGeolocPosition),
    enabled: isLoggedIn,
    retry: 0,
  })
}
