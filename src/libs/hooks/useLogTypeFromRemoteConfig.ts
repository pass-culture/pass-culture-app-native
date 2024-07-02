import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'
import { LogTypeEnum } from 'libs/monitoring/errors'

export const useLogTypeFromRemoteConfig = () => {
  const { shouldLogInfo } = useRemoteConfigContext()

  return { logType: shouldLogInfo ? LogTypeEnum.INFO : LogTypeEnum.IGNORED }
}
