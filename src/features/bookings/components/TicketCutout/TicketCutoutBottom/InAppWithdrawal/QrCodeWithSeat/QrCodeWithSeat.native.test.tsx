import React from 'react'

import { QrCodeWithSeat } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/QrCodeWithSeat/QrCodeWithSeat'
import { render, screen } from 'tests/utils'

const seatIndex = '1/1'
const seat = 'A19'
const barcode = 'PASSCULTURE:v3;TOKEN:352UW4'
const whiteSpace = ' '

describe('<QrCodeWithSeat/>', () => {
  it('should display the seat number on the total number of seats', () => {
    renderQrCodeWithSeat({})

    expect(screen.getByText(`Place\u00a0${seatIndex}\u00a0:${whiteSpace}`)).toBeOnTheScreen()
  })

  it('should display the seat number if there is a seat number', () => {
    renderQrCodeWithSeat({})

    expect(screen.getByText(`Siège\u00a0${seat}`)).toBeOnTheScreen()
  })

  it('should not display qr code when qr code should be hidden', () => {
    renderQrCodeWithSeat({ shouldQrCodeBeHidden: true })

    expect(screen.getByTestId('dashed-container-hiden-qrCode')).toBeOnTheScreen()
  })

  it('should display qr code when qr code should not be hidden', () => {
    renderQrCodeWithSeat({ shouldQrCodeBeHidden: false })

    expect(screen.getByTestId('qr-code')).toBeOnTheScreen()
  })
})

const renderQrCodeWithSeat = ({ shouldQrCodeBeHidden }: { shouldQrCodeBeHidden?: boolean }) => {
  render(
    <QrCodeWithSeat
      seatIndex={seatIndex}
      seat={seat}
      barcode={barcode}
      shouldQrCodeBeHidden={shouldQrCodeBeHidden}
    />
  )
}
