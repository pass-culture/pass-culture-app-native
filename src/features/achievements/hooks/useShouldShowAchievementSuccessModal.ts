import { useAuthContext } from 'features/auth/context/AuthContext'
import { ModalDisplayState } from 'features/home/components/helpers/useShouldShowReactionModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = (): ModalDisplayState => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()
  const { user } = useAuthContext()

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const isThereAtLeastOneUnseenAchievement = unseenAchievements.length

  return areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement
    ? ModalDisplayState.SHOULD_SHOW
    : ModalDisplayState.SHOULD_NOT_SHOW
}
