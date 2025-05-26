import React from 'react'

import { QrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { render, screen } from 'tests/utils'

const seatIndex = '1/1'
const seat = 'A19'
const barcode = 'PASSCULTURE:v3;TOKEN:352UW4'
const whiteSpace = ' '

describe('<QrCodeWithSeat/>', () => {
  it('should display the seat number on the total number of seats', async () => {
    render(<QrCodeWithSeat seatIndex={seatIndex} seat={seat} barcode={barcode} />)

    expect(screen.getByText(`Place\u00a0${seatIndex}\u00a0:${whiteSpace}`)).toBeOnTheScreen()
  })

  it('should display the seat number if there is a seat number', async () => {
    render(<QrCodeWithSeat seatIndex={seatIndex} seat={seat} barcode={barcode} />)

    expect(screen.getByText(`Siège\u00a0${seat}`)).toBeOnTheScreen()
  })
})
