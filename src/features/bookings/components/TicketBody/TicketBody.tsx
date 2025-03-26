import { addDays, isSameDay } from 'date-fns'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import {
  BookingReponse,
  BookingVenueResponse,
  SubcategoryIdEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { ExternalBookingTicket } from 'features/bookings/components/TicketBody/ExternalBookingTicket/ExternalBookingTicket'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { QrCodeWithSeatProps } from 'features/bookings/components/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { TicketCode } from 'features/bookings/components/TicketCode'
import { TicketWithdrawal } from 'features/bookings/components/TicketWithdrawal/TicketWithdrawal'
import { Typo } from 'ui/theme'

type Props = {
  withdrawalDelay: number
  withdrawalDetails?: string
  withdrawalType?: WithdrawalTypeEnum
  subcategoryId: SubcategoryIdEnum
  beginningDatetime?: string
  qrCodeData?: string
  externalBookings?: QrCodeWithSeatProps
  venue: BookingVenueResponse
  code?: BookingReponse['token']
  barCodeInfo: React.JSX.Element | null
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
  code,
  barCodeInfo,
}) => {
  const subcategoryShouldHaveQrCode = !notQrCodeSubcategories.includes(subcategoryId)
  const ticketInformation = <Typo.Body>Présente ce billet pour accéder à l’évènement</Typo.Body>

  const ticketToken = code ? (
    <TokenContainer>
      <TicketCode withdrawalType={withdrawalType ?? undefined} code={code} />
    </TokenContainer>
  ) : null

  if (externalBookings)
    return (
      <ExternalBookingTicket
        subcategoryId={subcategoryId}
        beginningDatetime={beginningDatetime}
        venue={venue}
        categoriesToHide={[SubcategoryIdEnum.CONCERT, SubcategoryIdEnum.FESTIVAL_MUSIQUE]}
        qrCodeVisibilityHoursBeforeEvent={48}
        {...externalBookings}
        barCodeInfo={barCodeInfo}
      />
    )

  if (qrCodeData && subcategoryShouldHaveQrCode)
    return (
      <React.Fragment>
        <QrCode qrCode={qrCodeData} /> {ticketToken} {ticketInformation}
      </React.Fragment>
    )

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

const TokenContainer = styled.View({ flexDirection: 'row' })
