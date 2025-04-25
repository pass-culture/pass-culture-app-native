import React from 'react'
import styled from 'styled-components/native'

import { BookingReponse } from 'api/gen'
import { TicketCode } from 'features/bookings/components/TicketCutout/TicketCutoutBottom/OnSiteWithdrawal/TicketCode'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { ButtonWithLinearGradient } from 'ui/components/buttons/buttonWithLinearGradient/ButtonWithLinearGradient'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { ExternalSiteFilled } from 'ui/svg/icons/ExternalSiteFilled'
import { getSpacing } from 'ui/theme'

export const DigitalOfferWithdrawal = ({
  booking,
  ean,
  hasActivationCode,
}: {
  booking: BookingReponse
  ean: React.JSX.Element | null
  hasActivationCode?: boolean
}) => {
  const { id: offerId, subcategoryId: offerSubcategory } = booking.stock.offer

  const activationCode = booking.activationCode ? (
    <TicketCode code={booking.activationCode.code} />
  ) : null

  const token = booking.token ? <TicketCode code={booking.token} /> : null

  const accessExternalOfferButton =
    booking.completedUrl && (hasActivationCode || booking.token) ? (
      <ExternalTouchableLink
        as={ButtonWithLinearGradient}
        wording={getDigitalOfferBookingWording(offerSubcategory)}
        icon={ExternalSiteFilled}
        externalNav={{ url: booking.completedUrl, params: { analyticsData: { offerId } } }}
      />
    ) : null

  return (
    <React.Fragment>
      {activationCode || token}
      <TicketContent>{accessExternalOfferButton} </TicketContent>
      {ean}
    </React.Fragment>
  )
}

const TicketContent = styled.View({
  paddingHorizontal: getSpacing(2),
})
