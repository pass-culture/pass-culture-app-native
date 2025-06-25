import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'

const birthdayNotificationsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'BirthdayNotifications 🎂',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBirthdayNotifications' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'Écran 18 ans',
      navigationTarget: { screen: 'EighteenBirthday' },
    },
    {
      id: uuidv4(),
      title: 'Notification re-crédit anniversaire',
      navigationTarget: { screen: 'RecreditBirthdayNotification' },
    },
  ],
}

export const cheatcodesNavigationBirthdayNotificationsButtons: CheatcodeCategory[] = [
  birthdayNotificationsCheatcodeCategory,
]

export function CheatcodesNavigationBirthdayNotifications(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={birthdayNotificationsCheatcodeCategory.title}>
      <CheatcodesSubscreensButtonList buttons={birthdayNotificationsCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
