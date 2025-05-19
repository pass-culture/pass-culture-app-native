import React from 'react'

import { TicketCode } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/TicketCode'
import { TicketText } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketText'
import { TicketVisual } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/TicketVisual'

export const OnSiteWithdrawal = ({ token }: { token: string }) => {
  return (
    <React.Fragment>
      <TicketVisual>
        <TicketCode code={token} />
      </TicketVisual>
      <TicketText>
        Présente le code ci-dessus à l’accueil du lieu indiqué avant le début de l’événement pour
        récupérer ton billet.
      </TicketText>
    </React.Fragment>
  )
}
