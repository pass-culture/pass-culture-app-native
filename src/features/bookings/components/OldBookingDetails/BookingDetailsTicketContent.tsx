import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse, CategoryIdEnum } from 'api/gen'
import { BookingComplementaryInfo } from 'features/bookings/components/OldBookingDetails/TicketBody/BookingComplementaryInfo/BookingComplementaryInfo'
import { QrCodeWithSeatProps } from 'features/bookings/components/OldBookingDetails/TicketBody/QrCodeWithSeat/QrCodeWithSeat'
import { TicketBody } from 'features/bookings/components/OldBookingDetails/TicketBody/TicketBody'
import { TicketCode } from 'features/bookings/components/OldBookingDetails/TicketCode'
import { getBookingProperties } from 'features/bookings/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { ButtonWithLinearGradientDeprecated } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradientDeprecated'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { ExternalSiteFilled as ExternalSiteFilledIcon } from 'ui/svg/icons/ExternalSiteFilled'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export type BookingDetailsTicketContentProps = {
  booking: BookingReponse
  externalBookings?: QrCodeWithSeatProps
}

export function BookingDetailsTicketContent({
  booking,
  externalBookings,
}: Readonly<BookingDetailsTicketContentProps>) {
  const { completedUrl } = booking
  const { offer, beginningDatetime } = booking.stock
  const {
    id: offerId,
    name: offerName,
    subcategoryId: offerSubcategory,
    extraData,
    withdrawalType,
    withdrawalDelay,
    venue,
  } = offer

  const { isEvent } = useSubcategory(offerSubcategory)
  const properties = getBookingProperties(booking, isEvent)

  const categoryId = useCategoryId(offerSubcategory)

  const ean =
    extraData?.ean && categoryId === CategoryIdEnum.LIVRE ? (
      <BookingComplementaryInfo title="EAN" value={extraData.ean} />
    ) : null

  const barCode =
    externalBookings?.barcode && categoryId === CategoryIdEnum.MUSIQUE_LIVE ? (
      <BookingComplementaryInfo title="REF" value={externalBookings.barcode} />
    ) : null

  const buttonWording = getDigitalOfferBookingWording(offerSubcategory)

  const activationCode = booking.activationCode ? (
    <TicketCode withdrawalType={withdrawalType ?? undefined} code={booking.activationCode.code} />
  ) : null
  const accessExternalOfferButton = completedUrl ? (
    <ExternalTouchableLink
      as={ButtonWithLinearGradientDeprecated}
      wording={buttonWording}
      icon={ExternalSiteFilledIcon}
      externalNav={{ url: completedUrl, params: { analyticsData: { offerId } } }}
    />
  ) : null

  const ticketToken = booking.token ? (
    <TicketCode withdrawalType={withdrawalType ?? undefined} code={booking.token} />
  ) : null

  const ticketContent = properties.isDigital ? (
    accessExternalOfferButton
  ) : (
    <TicketBody
      withdrawalType={withdrawalType ?? undefined}
      withdrawalDelay={withdrawalDelay ?? 0}
      beginningDatetime={beginningDatetime ?? undefined}
      subcategoryId={offerSubcategory}
      qrCodeData={booking.qrCodeData ?? undefined}
      externalBookings={externalBookings}
      venue={venue}
    />
  )

  return (
    <Container>
      <ViewGap gap={3}>
        <Title>{offerName}</Title>
        <TicketContent>
          {properties.hasActivationCode ? (
            <React.Fragment>
              {activationCode}
              {accessExternalOfferButton}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {ticketToken}
              {ticketContent}
            </React.Fragment>
          )}
        </TicketContent>
      </ViewGap>
      {ean || barCode}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  justifyContent: 'center',
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))

const Title = styled(Typo.Title3).attrs(getHeadingAttrs(1))(({ theme }) => ({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: theme.designSystem.size.spacing.s,
}))

const TicketContent = styled.View(({ theme }) => ({
  paddingHorizontal: theme.designSystem.size.spacing.s,
  paddingVertical: theme.designSystem.size.spacing.m,
}))
