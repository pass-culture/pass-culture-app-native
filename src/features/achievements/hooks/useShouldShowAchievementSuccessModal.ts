import { useAuthContext } from 'features/auth/context/AuthContext'
import { ModalDisplayState } from 'features/home/components/helpers/useShouldShowReactionModal'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = (): ModalDisplayState => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()
  const { user, isUserLoading } = useAuthContext()

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const isThereAtLeastOneUnseenAchievement = unseenAchievements.length

  if (isUserLoading) return ModalDisplayState.PENDING

  if (areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement)
    return ModalDisplayState.SHOULD_SHOW

  return ModalDisplayState.SHOULD_NOT_SHOW
}
