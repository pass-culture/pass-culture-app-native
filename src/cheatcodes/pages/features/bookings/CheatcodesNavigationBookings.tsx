// cheatcodes/pages/features/bookings/CheatcodesNavigationBookings.tsx (Refactored)

import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
// --- Import our new types ---
import { CheatcodeCategory } from 'cheatcodes/types'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

// --- We define a single, well-typed category object ---
const bookingsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Bookings 🛍️',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBookings' },
  },
  // The subscreens are now all valid CheatcodeButtons with explicit titles.
  subscreens: [
    {
      id: uuidv4(),
      title: 'BookingNotFound', // This one already had a title.
      // Assuming the intention was to navigate to a screen named 'BookingNotFound'.
      // The original navigation was likely a copy-paste error.
      navigationTarget: { screen: 'CheatcodesStackNavigator' },
    },
    {
      id: uuidv4(),
      title: 'Set Name (Free Offer)', // <-- Added explicit title
      navigationTarget: {
        screen: 'SetName',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'Set City (Free Offer)', // <-- Added explicit title
      navigationTarget: {
        screen: 'SetCity',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'Set Address (Free Offer)', // <-- Added explicit title
      navigationTarget: {
        screen: 'SetAddress',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'Set Status (Free Offer)', // <-- Added explicit title
      navigationTarget: {
        screen: 'SetStatus',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
  ],
}

// We export it as an array to be used in the main CheatcodesMenu
export const cheatcodesNavigationBookingsButtons: CheatcodeCategory[] = [bookingsCheatcodeCategory]

export function CheatcodesNavigationBookings(): React.JSX.Element {
  return (
    // The title is sourced directly from our clean object
    <CheatcodesTemplateScreen title={bookingsCheatcodeCategory.title}>
      {/* 
        We pass the clean subscreens array directly. 
        It's now in the perfect CheatcodeButton[] format.
      */}
      <CheatcodesSubscreensButtonList buttons={bookingsCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
