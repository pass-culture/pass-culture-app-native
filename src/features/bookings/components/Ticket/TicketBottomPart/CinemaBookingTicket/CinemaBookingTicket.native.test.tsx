import React from 'react'

import { CinemaBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/CinemaBookingTicket/CinemaBookingTicket'
import { render, screen } from 'tests/utils'

describe('CinemaBookingTicket', () => {
  it('should not display anything when token is null', async () => {
    renderCinemaBookingTicket({ voucher: 'test-voucher', token: null })

    expect(screen.queryByTestId('cinema-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should not display anything when voucher is an empty string', async () => {
    renderCinemaBookingTicket({ voucher: '', token: 'test-token' })

    expect(screen.queryByTestId('cinema-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should display container when token and voucher are present', async () => {
    renderCinemaBookingTicket({ voucher: 'test-voucher', token: 'test-token' })

    expect(screen.getByTestId('cinema-booking-ticket-container')).toBeOnTheScreen()
  })
})

const renderCinemaBookingTicket = ({
  voucher,
  token,
}: {
  voucher: string
  token: string | null | undefined
}) => {
  return render(<CinemaBookingTicket voucher={voucher} token={token} />)
}
