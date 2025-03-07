import { useQuery } from 'react-query'

import { QueryKeys } from 'libs/queryKeys'

import { DEFAULT_REMOTE_CONFIG } from '../remoteConfig.constants'
import { remoteConfig } from '../remoteConfig.services'
import { CustomRemoteConfig } from '../remoteConfig.types'

const fetchRemoteConfig = async (): Promise<CustomRemoteConfig> => {
  await remoteConfig.configure()
  await remoteConfig.refresh()
  return remoteConfig.getValues()
}

function useRemoteConfigQuery() {
  return useQuery<CustomRemoteConfig>([QueryKeys.REMOTE_CONFIG], fetchRemoteConfig, {
    placeholderData: DEFAULT_REMOTE_CONFIG,
  })
}

export function useRemoteConfig() {
  return useRemoteConfigQuery().data ?? DEFAULT_REMOTE_CONFIG
}
