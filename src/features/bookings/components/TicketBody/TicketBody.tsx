import { addDays, isSameDay } from 'date-fns'
import React, { FunctionComponent } from 'react'

import { BookingVenueResponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { SafeSeatWithQrCode } from 'features/bookings/components/TicketBody/SafeSeatWithQrCode/SafeSeatWithQrCode'
import { SeatWithQrCodeProps } from 'features/bookings/components/TicketBody/SeatWithQrCode/SeatWithQrCode'
import { TicketWithdrawal } from 'features/bookings/components/TicketBody/TicketWithdrawal/TicketWithdrawal'

type Props = {
  withdrawalDelay: number
  withdrawalDetails?: string
  withdrawalType?: WithdrawalTypeEnum
  subcategoryId: SubcategoryIdEnum
  beginningDatetime?: string
  qrCodeData?: string
  externalBookings?: SeatWithQrCodeProps
  venue: BookingVenueResponse
  isEvent: boolean
}

export const TicketBody: FunctionComponent<Props> = ({
  withdrawalDelay,
  withdrawalType,
  subcategoryId,
  beginningDatetime,
  qrCodeData,
  externalBookings,
  venue,
  isEvent,
}) => {
  if (externalBookings)
    return (
      <SafeSeatWithQrCode
        subcategoryId={subcategoryId}
        beginningDatetime={beginningDatetime}
        venue={venue}
        categoriesToHide={[SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.FESTIVAL_MUSIQUE]}
        qrCodeVisibilityHoursBeforeEvent={48}
        {...externalBookings}
      />
    )
  const subcategoryShouldHaveQrCode = !isEvent
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
