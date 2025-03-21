import { AchievementResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ModalDisplayState } from 'features/home/components/helpers/useBookingsReactionHelpers'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigQuery } from 'libs/firebase/remoteConfig/queries/useRemoteConfigQuery'

export const useShouldShowAchievementSuccessModal = (): {
  shouldShowAchievementSuccessModal: ModalDisplayState
  achievementsToShow: AchievementResponse[]
} => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigQuery()
  const { user, isUserLoading } = useAuthContext()

  const unseenAchievements = user?.achievements?.filter((achievement) => !achievement.seenDate)

  const isThereAtLeastOneUnseenAchievement = user?.achievements?.some(
    (achievement) => !achievement.seenDate
  )

  if (!user || isThereAtLeastOneUnseenAchievement === undefined || isUserLoading)
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.PENDING,
      achievementsToShow: [],
    }

  if (
    !areAchievementsEnabled ||
    !displayAchievements ||
    user?.achievements.length === 0 ||
    !isThereAtLeastOneUnseenAchievement
  )
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.SHOULD_NOT_SHOW,
      achievementsToShow: [],
    }

  return {
    shouldShowAchievementSuccessModal: ModalDisplayState.SHOULD_SHOW,
    achievementsToShow:
      unseenAchievements && unseenAchievements?.length > 0 ? unseenAchievements : [],
  }
}
