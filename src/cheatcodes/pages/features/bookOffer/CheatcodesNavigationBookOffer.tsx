// cheatcodes/pages/features/bookOffer/CheatcodesNavigationBookOffer.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'

// --- We define a single, well-typed category object ---
const bookOfferCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'BookOffer 🎫',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBookOffer' },
  },
  // The subscreen is now a well-defined CheatcodeButton
  subscreens: [
    {
      id: uuidv4(),
      title: 'Confirmation de réservation', // <-- Added an explicit, user-friendly title
      navigationTarget: {
        screen: 'BookingConfirmation',
        params: { offerId: 11224, bookingId: 1240 },
      },
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationBookOfferButtons: CheatcodeCategory[] = [
  bookOfferCheatcodeCategory,
]

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  return (
    // The title is sourced directly from our clean object
    <CheatcodesTemplateScreen title={bookOfferCheatcodeCategory.title}>
      {/* 
        We pass the clean subscreens array directly. 
        This is exactly what CheatcodesSubscreensButtonList expects.
      */}
      <CheatcodesSubscreensButtonList buttons={bookOfferCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
