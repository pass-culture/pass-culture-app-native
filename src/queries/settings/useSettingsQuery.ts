import { useQuery } from '@tanstack/react-query'

import { api } from 'api/api'
import { SettingsResponse } from 'api/gen'
import { QueryKeys } from 'libs/queryKeys'
import { CustomQueryOptions } from 'libs/react-query/types'

export const useSettingsQuery = <TSelect = SettingsResponse>(
  options?: CustomQueryOptions<SettingsResponse, TSelect>
) =>
  useQuery({
    queryKey: [QueryKeys.SETTINGS],
    queryFn: () => api.getNativeV1Settings(),
    staleTime: 60 * 60 * 1000, // 1H. More or less arbitrary.
    gcTime: 24 * 60 * 60 * 1000, // 1 day. More or less arbitrary.
    ...options,
  })
