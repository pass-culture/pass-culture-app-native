import { AchievementEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useRemoteConfigContext } from 'libs/firebase/remoteConfig/RemoteConfigProvider'

export const useShouldShowAchievementSuccessModal = () => {
  const areAchievementsEnabled = useFeatureFlag(RemoteStoreFeatureFlags.ENABLE_ACHIEVEMENTS)
  const { displayAchievements } = useRemoteConfigContext()
  const { user } = useAuthContext()

  let shouldShowAchievementSuccessModal = false
  let achievementsToShow: AchievementEnum[] = []
  if (
    !areAchievementsEnabled ||
    !displayAchievements ||
    !user?.achievements ||
    user?.achievements.length === 0
  )
    return { shouldShowAchievementSuccessModal, achievementsToShow }

  const isThereAtLeastOneUnseenAchievement = user?.achievements.some(
    (achievement) => !achievement.seenDate
  )
  if (isThereAtLeastOneUnseenAchievement) shouldShowAchievementSuccessModal = true
  else return { shouldShowAchievementSuccessModal, achievementsToShow }

  const unseenAchievements = user?.achievements
    .filter((achievement) => !achievement.seenDate)
    .map((achievement) => achievement.name)

  if (unseenAchievements && unseenAchievements?.length > 0) achievementsToShow = unseenAchievements

  return { shouldShowAchievementSuccessModal, achievementsToShow }
}
