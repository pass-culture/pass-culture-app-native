import { REDESIGN_AB_TESTING_HOME_MODULES } from 'libs/contentful/constants'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig'

type Props = {
  featureFlag: boolean
  homeId: string
}

export const useHasGraphicRedesign = ({ featureFlag, homeId }: Props) => {
  const { shouldApplyGraphicRedesign } = useRemoteConfigContext()
  const hasGraphicRedesign = REDESIGN_AB_TESTING_HOME_MODULES.includes(homeId)
    ? featureFlag && shouldApplyGraphicRedesign
    : featureFlag

  return hasGraphicRedesign
}
