import { REDESIGN_AB_TESTING_HOME_MODULES } from 'libs/contentful/constants'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

type Props = {
  isFeatureFlagActive: boolean
  homeId: string
}

export const useHasGraphicRedesign = ({ isFeatureFlagActive, homeId }: Props) => {
  const { shouldApplyGraphicRedesign } = useRemoteConfigContext()
  const hasGraphicRedesign = REDESIGN_AB_TESTING_HOME_MODULES.includes(homeId)
    ? isFeatureFlagActive && shouldApplyGraphicRedesign
    : isFeatureFlagActive

  return hasGraphicRedesign
}
