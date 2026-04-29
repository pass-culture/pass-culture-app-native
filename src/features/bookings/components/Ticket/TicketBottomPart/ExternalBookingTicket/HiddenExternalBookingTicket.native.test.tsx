import React from 'react'

import { HiddenExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/HiddenExternalBookingTicket'
import { render, screen } from 'tests/utils'

describe('HiddenExternalBookingTicket', () => {
  it('should display correctly hidden qrcode and singular text', async () => {
    renderHiddenExternalBookingTicket({
      beginningDateTime: '2025-07-21T20:00:00',
      isDuo: false,
    })

    expect(
      await screen.findByText('Ton billet sera disponible ici le 19 juillet 2025 à 22h00')
    ).toBeOnTheScreen()
  })

  it('should display text plural when multiple external bookings and qr code are hidden', async () => {
    renderHiddenExternalBookingTicket({
      beginningDateTime: '2025-07-21T20:00:00',
      isDuo: true,
    })

    expect(
      await screen.findByText('Tes billets seront disponibles ici le 19 juillet 2025 à 22h00')
    ).toBeOnTheScreen()
  })
})

const renderHiddenExternalBookingTicket = ({
  beginningDateTime,
  isDuo = false,
}: {
  beginningDateTime: string | undefined
  isDuo?: boolean
}) => {
  return render(<HiddenExternalBookingTicket beginningDatetime={beginningDateTime} isDuo={isDuo} />)
}
