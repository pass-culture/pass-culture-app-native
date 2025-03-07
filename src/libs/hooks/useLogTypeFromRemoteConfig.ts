import { useRemoteConfig } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { LogTypeEnum } from 'libs/monitoring/errors'

export const useLogTypeFromRemoteConfig = () => {
  const { shouldLogInfo } = useRemoteConfig()

  return { logType: shouldLogInfo ? LogTypeEnum.INFO : LogTypeEnum.IGNORED }
}
