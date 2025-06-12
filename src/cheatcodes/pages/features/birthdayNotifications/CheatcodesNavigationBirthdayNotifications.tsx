import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationBirthdayNotificationsButtons: [
  CheatcodesButtonsWithSubscreensProps,
] = [
  {
    title: 'BirthdayNotifications 🎂',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationBirthdayNotifications' },
    subscreens: [{ screen: 'EighteenBirthday' }, { screen: 'RecreditBirthdayNotification' }],
  },
]

export function CheatcodesNavigationBirthdayNotifications(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationBirthdayNotificationsButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationBirthdayNotificationsButtons} />
    </CheatcodesTemplateScreen>
  )
}
