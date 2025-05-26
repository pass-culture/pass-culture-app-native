import { addDays, isSameDay } from 'date-fns'
import React, { FunctionComponent } from 'react'

import { BookingVenueResponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { EmailSent } from 'features/bookings/components/OldBookingDetails/TicketBody/EmailSent/EmailSent'
import { HideableQrCodeWithSeat } from 'features/bookings/components/OldBookingDetails/TicketBody/HideableQrCodeWithSeat/HideableQrCodeWithSeat'
import { NoTicket } from 'features/bookings/components/OldBookingDetails/TicketBody/NoTicket/NoTicket'
import { QrCode } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCode/QrCode'
import { QrCodeWithSeatProps } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { TicketWithdrawal } from 'features/bookings/components/OldBookingDetails/TicketBody/TicketWithdrawal/TicketWithdrawal'

type Props = {
  withdrawalDelay: number
  withdrawalDetails?: string
  withdrawalType?: WithdrawalTypeEnum
  subcategoryId: SubcategoryIdEnum
  beginningDatetime?: string
  qrCodeData?: string
  externalBookings?: QrCodeWithSeatProps
  venue: BookingVenueResponse
}

const notQrCodeSubcategories = [
  SubcategoryIdEnum.FESTIVAL_MUSIQUE,
  SubcategoryIdEnum.CONCERT,
  SubcategoryIdEnum.EVENEMENT_MUSIQUE,
  SubcategoryIdEnum.FESTIVAL_SPECTACLE,
  SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
]

export const TicketBody: FunctionComponent<Props> = ({
  withdrawalDelay,
  withdrawalType,
  subcategoryId,
  beginningDatetime,
  qrCodeData,
  externalBookings,
  venue,
}) => {
  const subcategoryShouldHaveQrCode = !notQrCodeSubcategories.includes(subcategoryId)

  if (externalBookings)
    return (
      <HideableQrCodeWithSeat
        subcategoryId={subcategoryId}
        beginningDatetime={beginningDatetime}
        venue={venue}
        categoriesToHide={[SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.FESTIVAL_MUSIQUE]}
        qrCodeVisibilityHoursBeforeEvent={48}
        {...externalBookings}
      />
    )

  if (qrCodeData && subcategoryShouldHaveQrCode) return <QrCode qrCode={qrCodeData} />

  if (!withdrawalType) return null

  if (withdrawalType === WithdrawalTypeEnum.no_ticket) return <NoTicket />

  if (beginningDatetime && withdrawalType === WithdrawalTypeEnum.by_email) {
    // Calculation approximate date send e-mail
    const nbDays = withdrawalDelay / 60 / 60 / 24
    const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
    const today = new Date()
    const startOfferDate = new Date(beginningDatetime)

    if (isSameDay(startOfferDate, today) || today > dateSendEmail)
      return <EmailSent offerDate={startOfferDate} />
  }

  return <TicketWithdrawal withdrawalType={withdrawalType} withdrawalDelay={withdrawalDelay} />
}
