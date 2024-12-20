import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'
import {
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/achievements/data/AchievementData'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useModal } from 'ui/components/modals/useModal'

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
    <CheatcodesTemplateScreen title="Achievements 🏆">
      <LinkToComponent name="Achievements" navigationParams={{ from: 'cheatcodes' }} />
      <LinkToComponent
        title="AchievementSuccessModal (1 unlocked)"
        onPress={showModalOneAchievement}
      />
      <AchievementSuccessModal
        achievementsToShow={[userCompletedMovieBooking]}
        visible={visibleOneAchievement}
        hideModal={hideModalOneAchievement}
      />
      <LinkToComponent
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
