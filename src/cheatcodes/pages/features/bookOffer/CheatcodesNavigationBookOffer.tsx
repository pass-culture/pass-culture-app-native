import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'

const bookOfferCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'BookOffer 🎫',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBookOffer' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BookingConfirmation',
      navigationTarget: {
        screen: 'BookingConfirmation',
        params: { offerId: 11224, bookingId: 1240 },
      },
    },
  ],
}

export const cheatcodesNavigationBookOfferButtons: CheatcodeCategory[] = [
  bookOfferCheatcodeCategory,
]

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={bookOfferCheatcodeCategory.title}>
      <CheatcodesSubscreensButtonList buttons={bookOfferCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
