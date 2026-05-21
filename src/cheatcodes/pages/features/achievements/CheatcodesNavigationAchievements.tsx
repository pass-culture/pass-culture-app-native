import React, { FC } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import {
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/achievements/data/AchievementData'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { useModal } from 'ui/components/modals/useModal'

const achievementCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Achievements 🏆',
  navigationTarget: {
    screen: 'CheatcodesNavigationAchievements',
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Achievements',
      navigationTarget: {
        screen: 'Achievements',
      },
    },
    // These are "ContainerButtons". They exist for search but have no action here.
    // Their action is implemented manually on the destination screen below.
    {
      id: uuidv4(),
      title: 'AchievementSuccessModal (1 unlocked)',
      showOnlyInSearch: true,
    },
    {
      id: uuidv4(),
      title: 'AchievementSuccessModal (2+ unlocked)',
      showOnlyInSearch: true,
    },
  ],
}

export const cheatcodesNavigationAchievementsButtons: CheatcodeCategory[] = [
  achievementCheatcodeCategory,
]

export const CheatcodesNavigationAchievements: FC = () => {
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

  const visibleSubscreens = achievementCheatcodeCategory.subscreens.filter(
    (subscreen) => !subscreen.showOnlyInSearch
  )

  return (
    <CheatcodesTemplateScreen title={achievementCheatcodeCategory.title}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      <LinkToCheatcodesScreen
        key="modal-1"
        button={{
          id: uuidv4(),
          title: 'AchievementSuccessModal (1 unlocked)',
          onPress: showModalOneAchievement,
        }}
        variant="secondary"
      />
      <AchievementSuccessModal
        achievementsToShow={[userCompletedMovieBooking]}
        visible={visibleOneAchievement}
        hideModal={hideModalOneAchievement}
      />

      <LinkToCheatcodesScreen
        key="modal-2"
        button={{
          id: uuidv4(),
          title: 'AchievementSuccessModal (2+ unlocked)',
          onPress: showModalSeveralAchievements,
        }}
        variant="secondary"
      />
      <AchievementSuccessModal
        achievementsToShow={[userCompletedMovieBooking, userCompletedBookBooking]}
        visible={visibleSeveralAchievements}
        hideModal={hideModalSeveralAchievements}
      />
    </CheatcodesTemplateScreen>
  )
}
