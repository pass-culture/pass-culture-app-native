import React from 'react'

import {
  PhysicalGoodBookingTicket,
  PhysicalGoodBookingTicketProps,
} from 'features/bookings/components/Ticket/TicketBottomPart/PhysicalGoodBookingTicket/PhysicalGoodBookingTicket'
import { render, screen } from 'tests/utils'

describe('PhysicalGoodBookingTicket', () => {
  it('should display voucher', async () => {
    renderPhysicalGoodBookingTicket({
      voucherData: 'PASSCULTURE:v12;TOKEN:EAJFK3P',
      tokenData: 'EAJFK3P',
    })

    expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
  })

  it('should display token', async () => {
    renderPhysicalGoodBookingTicket({
      voucherData: 'PASSCULTURE:v12;TOKEN:EAJFK3P',
      tokenData: 'EAJFK3P',
    })

    expect(screen.getByText('EAJFK3P')).toBeOnTheScreen()
  })

  it('should display withdrawal indication without delay', async () => {
    renderPhysicalGoodBookingTicket({
      voucherData: 'PASSCULTURE:v12;TOKEN:EAJFK3P',
      tokenData: 'EAJFK3P',
    })

    expect(
      screen.getByText(
        `Présente le code ci-dessus à la caisse du lieu indiqué pour récupérer ton offre.`
      )
    ).toBeOnTheScreen()
  })

  it('should display withdrawal indication with delay', async () => {
    renderPhysicalGoodBookingTicket({
      voucherData: 'PASSCULTURE:v12;TOKEN:EAJFK3P',
      tokenData: 'EAJFK3P',
      expirationDate: 'avant le 5 juillet 2025',
    })

    expect(
      screen.getByText(
        `Présente le code ci-dessus à la caisse du lieu indiqué avant le 5 juillet 2025 pour récupérer ton offre.`
      )
    ).toBeOnTheScreen()
  })
})

const renderPhysicalGoodBookingTicket = ({
  voucherData,
  tokenData,
  expirationDate,
}: PhysicalGoodBookingTicketProps) => {
  return render(
    <PhysicalGoodBookingTicket
      voucherData={voucherData}
      tokenData={tokenData}
      expirationDate={expirationDate}
    />
  )
}
