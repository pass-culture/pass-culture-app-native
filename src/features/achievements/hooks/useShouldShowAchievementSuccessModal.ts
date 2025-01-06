import { useMemo } from 'react'

import { AchievementResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = (
  isAnotherModalOpen = false
): { shouldShowAchievementSuccessModal: boolean; achievementsToShow: AchievementResponse[] } => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()
  const { user } = useAuthContext()

  const unseenAchievements = useMemo(
    () => user?.achievements.filter((achievement) => !achievement.seenDate),
    [user?.achievements]
  )

  const isThereAtLeastOneUnseenAchievement = useMemo(
    () => user?.achievements.some((achievement) => !achievement.seenDate),
    [user?.achievements]
  )

  if (
    !areAchievementsEnabled ||
    !displayAchievements ||
    !user?.achievements ||
    user?.achievements.length === 0 ||
    !isThereAtLeastOneUnseenAchievement ||
    isAnotherModalOpen
  )
    return { shouldShowAchievementSuccessModal: false, achievementsToShow: [] }

  return {
    shouldShowAchievementSuccessModal: isThereAtLeastOneUnseenAchievement,
    achievementsToShow:
      unseenAchievements && unseenAchievements?.length > 0 ? unseenAchievements : [],
  }
}
