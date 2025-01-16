import { AchievementResponse } from 'api/gen'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = (unseenAchievements: AchievementResponse[]) => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()

  const isThereAtLeastOneUnseenAchievement = !!unseenAchievements.length
  return areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement
}
