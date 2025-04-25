import React from 'react'

import { BookingReponse, BookingsResponse, CategoryIdEnum } from 'api/gen'
import { BookingComplementaryInfo } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/BookingComplementaryInfo'
import {
  SoloTicket,
  SoloTicketProps,
} from 'features/bookings/components/TicketCutout/TicketCutoutBottom/InAppWithdrawal/SoloTicket'
import { bookingsSnap } from 'features/bookings/fixtures/bookingsSnap'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { render, screen, userEvent } from 'tests/utils'

const user = userEvent.setup()
jest.useFakeTimers()

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>
const ongoingBookings: BookingReponse = bookingsSnap.ongoing_bookings[0]
const mockExternalBookings = {
  seatIndex: '1/1',
  seat: 'A19',
  barcode: 'PASSCULTURE:v3;TOKEN:352UW4',
}

describe('SoloTicket', () => {
  it('should display offer link button and open url on press when offer is digital', async () => {
    const booking: BookingsResponse['ongoing_bookings'][number] = structuredClone(ongoingBookings)
    booking.stock.offer.isDigital = true
    booking.completedUrl = 'https://example.com'

    renderSoloTicket({
      booking,
      externalBookings: mockExternalBookings,
      categoryId: CategoryIdEnum.MUSIQUE_ENREGISTREE,
      shouldQrCodeBeHidden: false,
      qrCodeText: 'toto',
      subcategoryShouldHaveQrCode: true,
    })

    const offerButton = screen.getByText('Accéder à l’offre en ligne')
    await user.press(offerButton)

    expect(mockedOpenUrl).toHaveBeenCalledWith(
      booking.completedUrl,
      {
        analyticsData: {
          offerId: booking.stock.offer.id,
        },
      },
      true
    )
  })
})

const renderSoloTicket = ({
  externalBookings,
  booking,
  qrCodeText,
  categoryId,
  subcategoryShouldHaveQrCode,
  shouldQrCodeBeHidden,
}: Omit<SoloTicketProps, 'ean'>) => {
  render(
    <SoloTicket
      externalBookings={externalBookings}
      booking={booking}
      qrCodeText={qrCodeText}
      categoryId={categoryId}
      subcategoryShouldHaveQrCode={subcategoryShouldHaveQrCode}
      shouldQrCodeBeHidden={shouldQrCodeBeHidden}
      ean={<BookingComplementaryInfo title="EAN" value="NVOEZHF" />}
    />
  )
}
