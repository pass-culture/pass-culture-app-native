import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

export function useAppSettings(enabled = true) {
  return useQuery<SettingsResponse>(QueryKeys.SETTINGS, () => api.getnativev1settings(), {
    enabled,
  })
}
