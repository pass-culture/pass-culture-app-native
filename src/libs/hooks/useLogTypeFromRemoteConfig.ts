import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'
import { LogTypeEnum } from 'libs/monitoring/errors'

export const useLogTypeFromRemoteConfig = () => {
  const { shouldLogInfo } = useRemoteConfigQuery()

  return { logType: shouldLogInfo ? LogTypeEnum.INFO : LogTypeEnum.IGNORED }
}
