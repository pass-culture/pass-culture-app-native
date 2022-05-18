import { t } from '@lingui/macro'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { CategoryIdEnum, BookingReponse } from 'api/gen'
import { TicketCode } from 'features/bookings/atoms/TicketCode'
import { Ean } from 'features/bookings/components/TicketBody/Ean/Ean'
import { TicketBody } from 'features/bookings/components/TicketBody/TicketBody'
import { getBookingProperties } from 'features/bookings/helpers'
import { useCategoryId, useSubcategory } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { ExternalSite } from 'ui/svg/icons/ExternalSite'
import { getSpacing, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typography'

type Props = {
  booking: BookingReponse
  activationCodeFeatureEnabled?: boolean
}

export const BookingDetailsTicketContent: FunctionComponent<Props> = ({
  booking,
  activationCodeFeatureEnabled,
}) => {
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
    <Container>
      <Title>{offer.name}</Title>
      <Spacer.Column numberOfSpaces={2} />
      <TicketContent>
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
      </TicketContent>
      {!!shouldDisplayEAN && <Ean offer={offer} />}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  justifyContent: 'center',
  minHeight: theme.ticket.minHeight,
  width: '100%',
}))

const Title = styled(Typo.Title3).attrs(getHeadingAttrs(1))({
  textAlign: 'center',
  maxWidth: '100%',
  paddingHorizontal: getSpacing(2),
})

const TicketContent = styled.View({
  paddingTop: getSpacing(6),
  paddingHorizontal: getSpacing(2),
})
