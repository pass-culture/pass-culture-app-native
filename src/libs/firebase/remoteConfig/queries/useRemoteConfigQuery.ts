import { useQuery } from '@tanstack/react-query'

import { eventMonitoring } from 'libs/monitoring/services'
import { QueryKeys } from 'libs/queryKeys'
import { getErrorMessage } from 'shared/getErrorMessage/getErrorMessage'

import { DEFAULT_REMOTE_CONFIG } from '../remoteConfig.constants'
import { remoteConfig } from '../remoteConfig.services'
import { CustomRemoteConfig } from '../remoteConfig.types'

const fetchRemoteConfig = async (): Promise<CustomRemoteConfig> => {
  try {
    await remoteConfig.configure()
    await remoteConfig.refresh()
    return remoteConfig.getValues()
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    eventMonitoring.captureException(`Error fetching remote config: ${errorMessage}`, {
      extra: { error },
    })
    throw new Error(`Error fetching remote config: ${errorMessage}`)
  }
}

export const useRemoteConfigQuery = () => {
  const query = useQuery({
    queryKey: [QueryKeys.REMOTE_CONFIG],
    queryFn: fetchRemoteConfig,
    placeholderData: DEFAULT_REMOTE_CONFIG,
    staleTime: 1000 * 60 * 5,
    throwOnError: false,
  })
  return {
    ...query,
    data: query.data ?? DEFAULT_REMOTE_CONFIG,
  }
}
