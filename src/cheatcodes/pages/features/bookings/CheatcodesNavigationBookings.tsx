import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'

export const cheatcodesNavigationBookingsButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Bookings 🛍️',
    screen: 'CheatcodesNavigationBookings',
    subscreens: [{ screen: 'CheatcodesScreenBookingNotFound', title: 'BookingNotFound' }],
  },
]

export function CheatcodesNavigationBookings(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationBookingsButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationBookingsButtons} />
    </CheatcodesTemplateScreen>
  )
}
