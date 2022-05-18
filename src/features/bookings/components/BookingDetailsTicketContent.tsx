import { t } from '@lingui/macro'
import { addDays, isSameDay } from 'date-fns'
import * as React from 'react'
import styled from 'styled-components/native'

import {
  CategoryIdEnum,
  BookingOfferResponse,
  BookingReponse,
  SubcategoryIdEnum,
  WithdrawalTypeEnum,
} from 'api/gen'
import { TicketCode } from 'features/bookings/atoms/TicketCode'
import { DefaultBody } from 'features/bookings/components/TicketBody/DefaultBody/DefaultBody'
import { EmailSent } from 'features/bookings/components/TicketBody/EmailSent/EmailSent'
import { NoTicket } from 'features/bookings/components/TicketBody/NoTicket/NoTicket'
import { QrCode } from 'features/bookings/components/TicketBody/QrCode/QrCode'
import { getBookingProperties } from 'features/bookings/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

interface BookingDetailsTicketContentProps {
  booking: BookingReponse
  activationCodeFeatureEnabled?: boolean
}

export const notQrCodeSubcategories = [
  SubcategoryIdEnum.FESTIVAL_MUSIQUE,
  SubcategoryIdEnum.CONCERT,
  SubcategoryIdEnum.EVENEMENT_MUSIQUE,
  SubcategoryIdEnum.FESTIVAL_SPECTACLE,
  SubcategoryIdEnum.SPECTACLE_REPRESENTATION,
]

export const BookingDetailsTicketContent = (props: BookingDetailsTicketContentProps) => {
  const { booking, activationCodeFeatureEnabled } = props
  const offer = booking.stock.offer
  const { isEvent } = useSubcategory(offer.subcategoryId)
  const properties = getBookingProperties(booking, isEvent)

  const categoryId = useCategoryId(offer.subcategoryId)
  const shouldDisplayEAN = offer.extraData?.isbn && categoryId === CategoryIdEnum.LIVRE

  const accessOfferButton = (
    <TouchableLink
      as={ButtonWithLinearGradient}
      wording={t`Accéder à l'offre`}
      icon={ExternalSite}
      externalNav={
        offer.url ? { url: offer.url, params: { analyticsData: { offerId: offer.id } } } : undefined
      }
    />
  )

  const isDigitalAndActivationCodeEnabled =
    activationCodeFeatureEnabled && properties.hasActivationCode

  const withdrawalType = booking?.stock?.offer?.withdrawalType || undefined

  const ticketContent = properties.isDigital ? accessOfferButton : <TicketBody booking={booking} />
  return (
    <TicketContainer>
      <Title>{offer.name}</Title>
      <Spacer.Column numberOfSpaces={2} />
      <TicketInnerContent>
        {isDigitalAndActivationCodeEnabled ? (
          <React.Fragment>
            {!!booking.activationCode && (
              <TicketCode withdrawalType={withdrawalType} code={booking.activationCode?.code} />
            )}
            {accessOfferButton}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <TicketCode withdrawalType={withdrawalType} code={booking.token} />
            {ticketContent}
          </React.Fragment>
        )}
      </TicketInnerContent>
      {!!shouldDisplayEAN && <Ean offer={offer} />}
    </TicketContainer>
  )
}

type EanProps = {
  offer: BookingOfferResponse
}
const Ean = ({ offer }: EanProps) => (
  <EANContainer>
    <Typo.Caption>{t`EAN` + '\u00a0'}</Typo.Caption>
    <DarkGreyCaption>{offer.extraData?.isbn}</DarkGreyCaption>
  </EANContainer>
)

type TicketBodyProps = {
  booking: BookingReponse
}

const TicketBody = ({ booking }: TicketBodyProps) => {
  const withdrawalType = booking?.stock?.offer?.withdrawalType
  const withdrawalDelay = booking?.stock?.offer?.withdrawalDelay || 0
  const subcategoryOffer = booking?.stock?.offer?.subcategoryId
  const subcategoryShouldHaveQrCode = !notQrCodeSubcategories.includes(subcategoryOffer)

  if (booking.qrCodeData && subcategoryShouldHaveQrCode)
    return <QrCode qrCode={booking.qrCodeData} />

  if (!withdrawalType) {
    return null
  }

  if (withdrawalType === WithdrawalTypeEnum.no_ticket) {
    return <NoTicket />
  }

  const { beginningDatetime } = booking.stock
  if (beginningDatetime && withdrawalType === WithdrawalTypeEnum.by_email) {
    // Calculation approximate date send e-mail
    const nbDays = withdrawalDelay / 60 / 60 / 24
    const dateSendEmail = addDays(new Date(beginningDatetime), -nbDays)
    const today = new Date()
    const startOfferDate = new Date(beginningDatetime)

    if (isSameDay(startOfferDate, today) || today > dateSendEmail) {
      return <EmailSent offerDate={startOfferDate} />
    }
  }

  return <DefaultBody withdrawalType={withdrawalType} withdrawalDelay={withdrawalDelay} />
}

const DarkGreyCaption = styled(Typo.Caption)(({ theme }) => ({
  color: theme.colors.greyDark,
}))

const Title = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: getSpacing(2),
})

const TicketInnerContent = styled.View({
  paddingTop: getSpacing(6),
  paddingHorizontal: getSpacing(2),
})

const EANContainer = styled.View({
  flexDirection: 'row',
  marginTop: getSpacing(3),
  alignItems: 'center',
  justifyContent: 'center',
})

const TicketContainer = styled.View(({ theme }) => ({
  justifyContent: 'center',
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))
