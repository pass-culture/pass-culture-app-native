import React from 'react'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodesButtonsWithSubscreensProps } from 'cheatcodes/types'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

export const cheatcodesNavigationBookingsButtons: [CheatcodesButtonsWithSubscreensProps] = [
  {
    title: 'Bookings 🛍️',
    screen: 'CheatcodesStackNavigator',
    navigationParams: { screen: 'CheatcodesNavigationBookings' },
    subscreens: [
      {
        screen: 'CheatcodesStackNavigator',
        navigationParams: { screen: 'CheatcodesNavigationBookings' },
        title: 'BookingNotFound',
      },
      { screen: 'SetName', navigationParams: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } },
      { screen: 'SetCity', navigationParams: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } },
      { screen: 'SetAddress', navigationParams: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } },
      { screen: 'SetStatus', navigationParams: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 } },
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
