import { useQuery } from 'react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { defaultSettings } from 'features/auth/fixtures/fixtures'
import { QueryKeys } from 'libs/queryKeys'

// arbitrary. Should not change that often though
const STALE_TIME_APP_SETTINGS = 5 * 60 * 1000

export const useSettings = () => {
  const { data, isLoading } = useQuery<SettingsResponse>(
    [QueryKeys.SETTINGS],
    () => api.getNativeV1Settings(),
    {
      staleTime: STALE_TIME_APP_SETTINGS,
      initialData: defaultSettings,
    }
  )

  return { data, isLoading }
}
