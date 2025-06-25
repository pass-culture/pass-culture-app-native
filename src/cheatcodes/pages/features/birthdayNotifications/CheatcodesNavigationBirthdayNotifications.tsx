// cheatcodes/pages/features/birthdayNotifications/CheatcodesNavigationBirthdayNotifications.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'

// --- We define a single, well-typed category object ---
export const birthdayNotificationsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'BirthdayNotifications 🎂',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBirthdayNotifications' },
  },
  // The subscreens now have explicit, mandatory titles. No more guesswork!
  subscreens: [
    {
      id: uuidv4(),
      title: 'Écran 18 ans', // <-- Explicit title
      navigationTarget: { screen: 'EighteenBirthday' },
    },
    {
      id: uuidv4(),
      title: 'Notification re-crédit anniversaire', // <-- Explicit title
      navigationTarget: { screen: 'RecreditBirthdayNotification' },
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationBirthdayNotificationsButtons: CheatcodeCategory[] = [
  birthdayNotificationsCheatcodeCategory,
]

export function CheatcodesNavigationBirthdayNotifications(): React.JSX.Element {
  return (
    // The title is sourced directly from our clean object.
    <CheatcodesTemplateScreen title={birthdayNotificationsCheatcodeCategory.title}>
      {/* 
        We pass the clean subscreens array directly.
        CheatcodesSubscreensButtonList now receives a perfect CheatcodeButton[] prop.
      */}
      <CheatcodesSubscreensButtonList buttons={birthdayNotificationsCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
