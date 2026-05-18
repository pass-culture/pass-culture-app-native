import React from 'react'

import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { ExternalBookingTicketProps } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket/ExternalBookingTicket'
import { render, screen } from 'tests/utils'

describe('ExternalBookingTicket', () => {
  it('should display ticket when data is present', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      isDuo: false,
    })

    expect(await screen.findByText('RÉF 1234')).toBeOnTheScreen()
    expect(await screen.findByText('Siège B2')).toBeOnTheScreen()
  })

  it('should display tickets in carousel when multiple external bookings', async () => {
    renderExternalBookingTicket({
      data: [
        { barcode: '1234', seat: 'B2' },
        { barcode: '999', seat: 'A02' },
      ],
      isDuo: true,
    })

    expect(await screen.findByText('RÉF 1234')).toBeOnTheScreen()
    expect(await screen.findByText('Siège B2')).toBeOnTheScreen()
    expect(await screen.findByText('RÉF 999')).toBeOnTheScreen()
    expect(await screen.findByText('Siège A02')).toBeOnTheScreen()
  })

  it('should display text plural when multiple external bookings', async () => {
    renderExternalBookingTicket({
      data: [
        { barcode: '1234', seat: 'B2' },
        { barcode: '999', seat: 'A02' },
      ],
      isDuo: true,
    })

    expect(
      await screen.findByText('Présente ces billets pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })

  it('should display text singular when single external bookings', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      isDuo: false,
    })

    expect(
      await screen.findByText('Présente ce billet pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })
})

const renderExternalBookingTicket = ({ data, isDuo = false }: ExternalBookingTicketProps) => {
  return render(<ExternalBookingTicket data={data} isDuo={isDuo} />)
}
