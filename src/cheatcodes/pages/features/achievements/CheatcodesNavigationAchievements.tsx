// cheatcodes/pages/features/achievements/CheatcodesNavigationAchievements.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToCheatcodesScreen } from 'cheatcodes/components/LinkToCheatcodesScreen'
// --- Import the new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
import {
  userCompletedBookBooking,
  userCompletedMovieBooking,
} from 'features/achievements/data/AchievementData'
import { AchievementSuccessModal } from 'features/achievements/pages/AchievementSuccessModal'
import { getCheatcodesStackConfig } from 'features/navigation/CheatcodesStackNavigator/getCheatcodesStackConfig'
import { useGoBack } from 'features/navigation/useGoBack'
import { useModal } from 'ui/components/modals/useModal'

// --- We define a single, well-typed category object ---
// This represents the "Achievements" section in the main cheatcodes menu.
export const achievementCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Achievements 🏆',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationAchievements' },
  },
  // The subscreens are now clearly defined CheatcodeButtons
  subscreens: [
    {
      id: uuidv4(),
      title: 'Liste des achievements', // Title is now mandatory and descriptive
      navigationTarget: {
        screen: 'Achievements',
        params: { from: 'cheatcodes' },
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

// We wrap it in an array for consistency with the main menu's expectations.
export const cheatcodesNavigationAchievementsButtons: CheatcodeCategory[] = [
  achievementCheatcodeCategory,
]

export function CheatcodesNavigationAchievements(): React.JSX.Element {
  const { goBack } = useGoBack(...getCheatcodesStackConfig('CheatcodesMenu'))
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
    <CheatcodesTemplateScreen title={achievementCheatcodeCategory.title} onGoBack={goBack}>
      <CheatcodesSubscreensButtonList buttons={visibleSubscreens} />

      {/* --- THE FIX IS HERE --- */}
      {/* We now construct a CheatcodeButton object and pass it to the 'button' prop. */}
      <LinkToCheatcodesScreen
        key="modal-1"
        button={{
          id: 'modal-1-button',
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

      {/* --- AND THE FIX IS HERE TOO --- */}
      <LinkToCheatcodesScreen
        key="modal-2"
        button={{
          id: 'modal-2-button',
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
