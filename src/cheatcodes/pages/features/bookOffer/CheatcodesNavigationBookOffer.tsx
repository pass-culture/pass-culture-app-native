import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToComponent } from 'cheatcodes/components/LinkToComponent'

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Internal (Maketing) 🎯">
      <LinkToComponent
        name="BookingConfirmation"
        navigationParams={{ offerId: 11224, bookingId: 1240 }}
      />
    </CheatcodesTemplateScreen>
  )
}
