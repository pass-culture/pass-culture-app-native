import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'

const bookingsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Bookings 🛍️',
  navigationTarget: {
    screen: 'CheatcodesNavigationBookings',
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BookingNotFound',
      navigationTarget: { screen: 'CheatcodesStackNavigator' },
    },
  ],
}

export const cheatcodesNavigationBookingsButtons: CheatcodeCategory[] = [bookingsCheatcodeCategory]

export function CheatcodesNavigationBookings(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={bookingsCheatcodeCategory.title}>
      <CheatcodesSubscreensButtonList buttons={bookingsCheatcodeCategory.subscreens} />
    </CheatcodesTemplateScreen>
  )
}
