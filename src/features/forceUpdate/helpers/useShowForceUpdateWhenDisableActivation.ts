import { ForceUpdateWithResetErrorBoundary } from 'features/forceUpdate/pages/ForceUpdateWithResetErrorBoundary'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { ScreenError, LogTypeEnum } from 'libs/monitoring/errors'

export const useShowForceUpdateWhenDisableActivation = () => {
  const disableAction = useFeatureFlag(RemoteStoreFeatureFlags.DISABLE_ACTIVATION)
  if (disableAction)
    throw new ScreenError('Must update app', {
      Screen: ForceUpdateWithResetErrorBoundary,
      logType: LogTypeEnum.IGNORED,
    })
}
