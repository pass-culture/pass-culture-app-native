import { useNetInfo } from '@react-native-community/netinfo'
import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useAppSettings() {
  const networkInfo = useNetInfo()

  return useQuery<SettingsResponse>(QueryKeys.SETTINGS, () => api.getnativev1settings(), {
    enabled: networkInfo.isConnected,
  })
}
