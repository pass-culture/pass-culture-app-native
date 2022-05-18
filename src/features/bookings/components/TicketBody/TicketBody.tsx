import { addDays, isSameDay } from 'date-fns'
import React, { FunctionComponent } from 'react'

import { BookingReponse, SubcategoryIdEnum, WithdrawalTypeEnum } from 'api/gen'
import { DefaultBody } from 'features/bookings/components/TicketBody/DefaultBody/DefaultBody'
import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'

type Props = {
  booking: BookingReponse
}

const notQrCodeSubcategories = [
  SubcategoryIdEnum.FESTIVAL_MUSIQUE,
  SubcategoryIdEnum.CONCERT,
  SubcategoryIdEnum.EVENEMENT_MUSIQUE,
  SubcategoryIdEnum.FESTIVAL_SPECTACLE,
  SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
]

export const TicketBody: FunctionComponent<Props> = ({ booking }) => {
  const withdrawalType = booking?.stock?.offer?.withdrawalType
  const withdrawalDelay = booking?.stock?.offer?.withdrawalDelay || 0
  const subcategoryOffer = booking?.stock?.offer?.subcategoryId
  const subcategoryShouldHaveQrCode = !notQrCodeSubcategories.includes(subcategoryOffer)

  if (booking.qrCodeData && subcategoryShouldHaveQrCode)
    return <QrCode qrCode={booking.qrCodeData} />

  if (!withdrawalType) return null

  if (withdrawalType === WithdrawalTypeEnum.no_ticket) return <NoTicket />

  const { beginningDatetime } = booking.stock
  if (beginningDatetime && withdrawalType === WithdrawalTypeEnum.by_email) {
    // Calculation approximate date send e-mail
    const nbDays = withdrawalDelay / 60 / 60 / 24
    const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
    const today = new Date()
    const startOfferDate = new Date(beginningDatetime)

    if (isSameDay(startOfferDate, today) || today > dateSendEmail)
      return <EmailSent offerDate={startOfferDate} />
  }

  return <DefaultBody withdrawalType={withdrawalType} withdrawalDelay={withdrawalDelay} />
}
