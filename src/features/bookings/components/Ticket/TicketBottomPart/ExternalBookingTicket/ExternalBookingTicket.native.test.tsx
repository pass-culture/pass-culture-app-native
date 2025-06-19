import React from 'react'

import { ExternalBookingDataResponseV2 } from 'api/gen'
import { ExternalBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/ExternalBookingTicket'
import { render, screen } from 'tests/utils'

describe('ExternalBookingTicket', () => {
  it('should not display anything when data is empty', async () => {
    renderExternalBookingTicket({ data: [] })

    expect(screen.queryByTestId('external-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should display container when data is present', async () => {
    renderExternalBookingTicket({
      data: [{ barcode: '1234', seat: 'B2' }],
    })

    expect(screen.getByTestId('external-booking-ticket-container')).toBeOnTheScreen()
  })
})

const renderExternalBookingTicket = ({ data }: { data: ExternalBookingDataResponseV2[] }) => {
  return render(<ExternalBookingTicket data={data} />)
}
