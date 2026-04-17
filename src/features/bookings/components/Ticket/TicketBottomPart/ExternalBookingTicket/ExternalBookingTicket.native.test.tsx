import React from 'react'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { render, screen } from 'tests/utils'

describe('ExternalBookingTicket', () => {
  it('should display ticket when data is present', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      beginningDateTime: undefined,
      hideTicket: false,
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
      beginningDateTime: undefined,
      hideTicket: false,
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
      beginningDateTime: undefined,
      isDuo: true,
      hideTicket: false,
    })

    expect(
      await screen.findByText('Présente ces billets pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })

  it('should display text singular when single external bookings', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      beginningDateTime: undefined,
      isDuo: false,
      hideTicket: false,
    })

    expect(
      await screen.findByText('Présente ce billet pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })
})

const renderExternalBookingTicket = ({
  data,
  isDuo = false,
}: {
  data: ExternalBookingDataResponseV2[]
  beginningDateTime: string | undefined
  isDuo?: boolean
  hideTicket: boolean
}) => {
  return render(<ExternalBookingTicket data={data} isDuo={isDuo} />)
}
