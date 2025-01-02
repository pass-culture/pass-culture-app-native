import React from 'react'

import { CheatcodesTemplateScreen } from 'cheatcodes/components/CheatcodesTemplateScreen'
import { LinkToScreen } from 'cheatcodes/components/LinkToScreen'

export function CheatcodesNavigationBookOffer(): React.JSX.Element {
  return (
    <CheatcodesTemplateScreen title="Internal (Maketing) 🎯">
      <LinkToScreen
        screen="BookingConfirmation"
        navigationParams={{ offerId: 11224, bookingId: 1240 }}
      />
    </CheatcodesTemplateScreen>
  )
}
