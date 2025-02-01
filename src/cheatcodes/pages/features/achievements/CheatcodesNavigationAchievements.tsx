import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import {
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/achievements/data/AchievementData'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useModal } from 'ui/components/modals/useModal'

export const cheatcodesNavigationAchievementsButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Achievements 🏆',
    screen: 'CheatcodesNavigationAchievements',
    subscreens: [
      { screen: 'Achievements', navigationParams: { from: 'cheatcodes' } },
      { title: 'AchievementSuccessModal (1 unlocked)', showOnlyInSearch: true },
      { title: 'AchievementSuccessModal (2+ unlocked)', showOnlyInSearch: true },
    ],
  },
]

export function CheatcodesNavigationAchievements(): React.JSX.Element {
  const {
    visible: visibleOneAchievement,
    showModal: showModalOneAchievement,
    hideModal: hideModalOneAchievement,
  } = useModal(false)

  const {
    visible: visibleSeveralAchievements,
    showModal: showModalSeveralAchievements,
    hideModal: hideModalSeveralAchievements,
  } = useModal(false)

  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationAchievementsButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationAchievementsButtons} />

      <LinkToScreen
        title="AchievementSuccessModal (1 unlocked)"
        onPress={showModalOneAchievement}
      />
      <AchievementSuccessModal
        achievementsToShow={[userCompletedMovieBooking]}
        visible={visibleOneAchievement}
        hideModal={hideModalOneAchievement}
      />

      <LinkToScreen
        title="AchievementSuccessModal (2+ unlocked)"
        onPress={showModalSeveralAchievements}
      />
      <AchievementSuccessModal
        achievementsToShow={[userCompletedMovieBooking, userCompletedBookBooking]}
        visible={visibleSeveralAchievements}
        hideModal={hideModalSeveralAchievements}
      />
    </CheatcodesTemplateScreen>
  )
}
