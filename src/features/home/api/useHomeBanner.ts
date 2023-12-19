import { useQuery } from 'react-query'

import { api } from 'api/api'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useNetInfoContext } from 'libs/network/NetInfoWrapper'
import { QueryKeys } from 'libs/queryKeys'

export function useHomeBanner(hasGeolocPosition: boolean) {
  const { isLoggedIn } = useAuthContext()
  const netInfo = useNetInfoContext()

  return useQuery(
    [QueryKeys.HOME_BANNER, hasGeolocPosition],
    () => api.getNativeV1Banner(hasGeolocPosition),
    {
      enabled: !!netInfo.isConnected && isLoggedIn,
    }
  )
}
