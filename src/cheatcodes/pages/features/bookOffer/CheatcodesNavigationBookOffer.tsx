import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationBookOfferButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'BookOffer 🎫',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationBookOffer' },
    subscreens: [
      { screen: 'BookingConfirmation', navigationParams: { offerId: 11224, bookingId: 1240 } },
    ],
  },
]

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationBookOfferButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationBookOfferButtons} />
    </CheatcodesTemplateScreen>
  )
}
