import { AchievementResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ModalDisplayState } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = (): {
  shouldShowAchievementSuccessModal: ModalDisplayState
  achievementsToShow: AchievementResponse[]
} => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()
  const { user, isUserLoading } = useAuthContext()

  const unseenAchievements =
    user?.achievements?.filter((achievement) => !achievement.seenDate) || []

  const isThereAtLeastOneUnseenAchievement = unseenAchievements.length

  if (isUserLoading)
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.PENDING,
      achievementsToShow: [],
    }

  if (areAchievementsEnabled && displayAchievements && isThereAtLeastOneUnseenAchievement)
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.SHOULD_SHOW,
      achievementsToShow: unseenAchievements,
    }

  return {
    shouldShowAchievementSuccessModal: ModalDisplayState.SHOULD_NOT_SHOW,
    achievementsToShow: [],
  }
}
