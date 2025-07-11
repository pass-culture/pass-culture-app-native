import React from 'react'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { render, screen } from 'tests/utils'

describe('ExternalBookingTicket', () => {
  it('should display hidden ticket when data is empty', async () => {
    renderExternalBookingTicket({ data: [], beginningDateTime: '2025-07-21T20:00:00' })

    expect(
      await screen.findByText('Ton billet sera disponible ici le 19 juillet 2025 à 22h00')
    ).toBeOnTheScreen()
  })

  it('should display ticket when data is present', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      beginningDateTime: undefined,
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
    })

    expect(await screen.findByText('RÉF 1234')).toBeOnTheScreen()
    expect(await screen.findByText('Siège B2')).toBeOnTheScreen()
    expect(await screen.findByText('RÉF 999')).toBeOnTheScreen()
    expect(await screen.findByText('Siège A02')).toBeOnTheScreen()
  })

  it('should display text plural when multiple external bookings and qr code are still hidden', async () => {
    renderExternalBookingTicket({
      data: [],
      beginningDateTime: '2025-07-21T20:00:00',
      isDuo: true,
    })

    expect(
      await screen.findByText('Tes billets seront disponibles ici le 19 juillet 2025 à 22h00')
    ).toBeOnTheScreen()
  })

  it('should display text plural when multiple external bookings and qr code are visible', async () => {
    renderExternalBookingTicket({
      data: [
        { barcode: '1234', seat: 'B2' },
        { barcode: '999', seat: 'A02' },
      ],
      beginningDateTime: undefined,
      isDuo: true,
    })

    expect(
      await screen.findByText('Présente ces billets pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })

  it('should display text singular when single external bookings and qr code is visible', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
      beginningDateTime: undefined,
      isDuo: false,
    })

    expect(
      await screen.findByText('Présente ce billet pour accéder à l’évènement.')
    ).toBeOnTheScreen()
  })
})

const renderExternalBookingTicket = ({
  data,
  beginningDateTime,
  isDuo = false,
}: {
  data: ExternalBookingDataResponseV2[]
  beginningDateTime: string | undefined
  isDuo?: boolean
}) => {
  return render(
    <ExternalBookingTicket data={data} beginningDatetime={beginningDateTime} isDuo={isDuo} />
  )
}
