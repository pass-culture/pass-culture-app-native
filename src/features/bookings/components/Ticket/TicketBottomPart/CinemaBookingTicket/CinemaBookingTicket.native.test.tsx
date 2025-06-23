import React from 'react'

import { TokenResponse, VoucherResponse } from 'api/gen'
import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { render, screen } from 'tests/utils'

describe('CinemaBookingTicket', () => {
  it('should not display anything when token is null', async () => {
    renderCinemaBookingTicket({ voucher: { data: 'test-voucher' }, token: null })

    expect(screen.queryByTestId('cinema-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should not display anything when voucher is null', async () => {
    renderCinemaBookingTicket({ voucher: null, token: { data: 'test-token' } })

    expect(screen.queryByTestId('cinema-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should display container when token and voucher are present', async () => {
    renderCinemaBookingTicket({ voucher: { data: 'test-voucher' }, token: { data: 'test-token' } })

    expect(screen.getByTestId('cinema-booking-ticket-container')).toBeOnTheScreen()
  })
})

const renderCinemaBookingTicket = ({
  voucher,
  token,
}: {
  voucher: VoucherResponse | null
  token: TokenResponse | null
}) => {
  return render(<CinemaBookingTicket voucher={voucher} token={token} />)
}
