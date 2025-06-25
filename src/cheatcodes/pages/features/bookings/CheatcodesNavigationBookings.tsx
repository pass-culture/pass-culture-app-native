import React from 'react'
import { v4 as uuidv4 } from 'uuid'

import { CheatcodesSubscreensButtonList } from 'cheatcodes/components/CheatcodesSubscreenButtonList'
import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { CheatcodeCategory } from 'cheatcodes/types'
import { ProfileTypes } from 'features/identityCheck/pages/profile/enums'

const bookingsCheatcodeCategory: CheatcodeCategory = {
  id: uuidv4(),
  title: 'Bookings 🛍️',
  navigationTarget: {
    screen: 'CheatcodesStackNavigator',
    params: { screen: 'CheatcodesNavigationBookings' },
  },
  subscreens: [
    {
      id: uuidv4(),
      title: 'BookingNotFound',
      navigationTarget: { screen: 'CheatcodesStackNavigator' },
    },
    {
      id: uuidv4(),
      title: 'SetName',
      navigationTarget: {
        screen: 'SetName',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'SetCity',
      navigationTarget: {
        screen: 'SetCity',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'SetAddress',
      navigationTarget: {
        screen: 'SetAddress',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
    },
    {
      id: uuidv4(),
      title: 'SetStatus',
      navigationTarget: {
        screen: 'SetStatus',
        params: { type: ProfileTypes.BOOKING_FREE_OFFER_15_16 },
      },
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
