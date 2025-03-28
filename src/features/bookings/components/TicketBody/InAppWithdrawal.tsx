import React from 'react'
import { View } from 'react-native'

import { BookingReponse, CategoryIdEnum, SubcategoryIdEnum } from 'api/gen'
import { TicketWithContent } from 'features/bookings/components/Ticket/TicketWithContent'
import { BookingComplementaryInfo } from 'features/bookings/components/TicketBody/BookingComplementaryInfo/BookingComplementaryInfo'
import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'

const MAX_NUMBER_TICKET_TO_DISPALY = 2
const SHOULD_NOT_HAVE_QR_CODE_SUBCATEGORIES = [
  SubcategoryIdEnum.FESTIVAL_MUSIQUE,
  SubcategoryIdEnum.CONCERT,
  SubcategoryIdEnum.EVENEMENT_MUSIQUE,
  SubcategoryIdEnum.FESTIVAL_SPECTACLE,
  SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
]

export const InAppWithdrawal = ({
  categoryId,
  booking,
  subcategoryId,
}: {
  booking: BookingReponse
  categoryId: CategoryIdEnum
  subcategoryId: SubcategoryIdEnum
}) => {
  if (!booking.externalBookings) return { tickets: [] }
  const externalBookings = booking.externalBookings.slice(0, MAX_NUMBER_TICKET_TO_DISPALY)
  const numberOfExternalBookings = externalBookings.length

  const subcategoryShouldHaveQrCode = !SHOULD_NOT_HAVE_QR_CODE_SUBCATEGORIES.includes(subcategoryId)

  if (externalBookings){
    const barCode =
  externalBookings[0]?.barcode && categoryId === CategoryIdEnum.MUSIQUE_LIVE ? (
    <BookingComplementaryInfo title="REF" value={externalBookings[0].barcode} />
  ) : null
    return (
/*       <HideableQrCodeWithSeat
        subcategoryId={subcategoryId}
        beginningDatetime={beginningDatetime}
        venue={venue}
        categoriesToHide={[SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.FESTIVAL_MUSIQUE]}
        qrCodeVisibilityHoursBeforeEvent={48}
        {...externalBookings}
      /> */
    )}

  if (booking.qrCodeData && subcategoryShouldHaveQrCode) return <QrCode qrCode={booking.qrCodeData} />

  if (numberOfExternalBookings === 0)
    return {
      tickets: [
        <TicketWithContent
          key={booking.id}
          booking={booking}
          testID="ticket-without-external-bookings-information"
        />,
      ],
    }

   

  return {
    tickets: externalBookings.map(({ seat, barcode }, index) => {
      const seatNumber = seat ?? undefined
      const seatWithNumberOfSeats =
        numberOfExternalBookings > 1 ? `${index + 1}/${numberOfExternalBookings}` : undefined
      return (
        <View key={seatNumber}>
          {barCode}
          <TicketWithContent
            booking={booking}
            externalBookings={{ seat: seatNumber, seatIndex: seatWithNumberOfSeats, barcode }}
            testID="ticket-with-external-bookings-information"
          />
        </View>
      )
    }),
  }
}
