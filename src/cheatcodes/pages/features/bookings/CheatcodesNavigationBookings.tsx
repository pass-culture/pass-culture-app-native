import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

export const cheatcodesNavigationBookingsButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Bookings 🛍️',
    screen: 'CheatcodesNavigationBookings',
    subscreens: [
      { screen: 'CheatcodesScreenBookingNotFound', title: 'BookingNotFound' },
      { screen: 'SetName', navigationParams: { type: ProfileTypes.BOOKING } },
      { screen: 'SetCity', navigationParams: { type: ProfileTypes.BOOKING } },
      { screen: 'SetAddress', navigationParams: { type: ProfileTypes.BOOKING } },
      { screen: 'SetStatus', navigationParams: { type: ProfileTypes.BOOKING } },
    ],
  },
]

export function CheatcodesNavigationBookings(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title={cheatcodesNavigationBookingsButtons[0].title}>
      <CheatcodesSubscreensButtonList buttons={cheatcodesNavigationBookingsButtons} />
    </CheatcodesTemplateScreen>
  )
}
