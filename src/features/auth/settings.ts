import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. Should not change that often though
const STALE_TIME_APP_SETTINGS = 5 * 60 * 1000

export function useAppSettings(options = {}) {
  return useQuery<SettingsResponse>(QueryKeys.SETTINGS, () => api.getnativev1settings(), {
    enabled: true,
    ...options,
    staleTime: STALE_TIME_APP_SETTINGS,
    select: (data) => ({ ...data, enableCulturalSurvey: true }),
  })
}
