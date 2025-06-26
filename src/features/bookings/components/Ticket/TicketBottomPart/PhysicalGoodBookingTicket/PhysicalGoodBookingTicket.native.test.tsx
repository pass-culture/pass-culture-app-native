import React from 'react'

import { TokenResponse, VoucherResponse } from 'api/gen'
import { PhysicalGoodBookingTicket } from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { render, screen } from 'tests/utils'

describe('PhysicalGoodBookingTicket', () => {
  it('should not display anything when voucher is valid but token and ean are null', async () => {
    renderPhysicalGoodBookingTicket({ voucher: { data: 'test-voucher' }, token: null, ean: null })

    expect(screen.queryByTestId('physical-good-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should not display anything when token is valid but voucher and ean are null', async () => {
    renderPhysicalGoodBookingTicket({ voucher: null, token: { data: 'test-token' }, ean: null })

    expect(screen.queryByTestId('physical-good-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should not display anything when ean is valid but token and voucher are null', async () => {
    renderPhysicalGoodBookingTicket({ voucher: null, token: { data: 'test-token' }, ean: '1234' })

    expect(screen.queryByTestId('physical-good-booking-ticket-container')).not.toBeOnTheScreen()
  })

  it('should display container when token, voucher and ean are present', async () => {
    renderPhysicalGoodBookingTicket({
      voucher: { data: 'test-voucher' },
      token: { data: 'test-token' },
      ean: '1234',
    })

    expect(screen.getByTestId('physical-good-booking-ticket-container')).toBeOnTheScreen()
  })
})

const renderPhysicalGoodBookingTicket = ({
  voucher,
  token,
  ean,
}: {
  voucher: VoucherResponse | null
  token: TokenResponse | null
  ean: string | null
}) => {
  return render(<PhysicalGoodBookingTicket voucher={voucher} token={token} ean={ean} />)
}
