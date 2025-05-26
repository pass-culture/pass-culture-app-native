import { Platform } from 'react-native'

import { AchievementResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { ModalDisplayState } from 'features/home/components/helpers/useBookingsReactionHelpers'

const isWeb = Platform.OS === 'web'

export const useShouldShowAchievementSuccessModal = (): {
  shouldShowAchievementSuccessModal: ModalDisplayState
  achievementsToShow: AchievementResponse[]
} => {
  const { user, isUserLoading } = useAuthContext()

  const unseenAchievements = user?.achievements?.filter((achievement) => !achievement.seenDate)

  const isThereAtLeastOneUnseenAchievement = user?.achievements?.some(
    (achievement) => !achievement.seenDate
  )

  if (isWeb) {
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.SHOULD_NOT_SHOW,
      achievementsToShow: [],
    }
  }

  if (!user || isThereAtLeastOneUnseenAchievement === undefined || isUserLoading)
    return {
      shouldShowAchievementSuccessModal: ModalDisplayState.PENDING,
      achievementsToShow: [],
    }

  if (user?.achievements.length === 0 || !isThereAtLeastOneUnseenAchievement)
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
