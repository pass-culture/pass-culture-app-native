import React from 'react'

import { SubcategoryIdEnum } from 'api/gen'
import { TicketCode } from 'features/bookings/components/Ticket/TicketBottomPart/TicketCode'
import { getDigitalOfferBookingWording } from 'shared/getDigitalOfferBookingWording/getDigitalOfferBookingWording'
import { ExternalTouchableLink } from 'ui/components/touchableLink/ExternalTouchableLink'
import { Button } from 'ui/designSystem/Button/Button'
import { ExternalSiteFilled as ExternalSiteFilledIcon } from 'ui/svg/icons/ExternalSiteFilled'

export const DigitalTicket = ({
  code,
  completedUrl,
  offerId,
  subcategoryId,
  onBeforeNavigate,
}: {
  code: string
  completedUrl: string
  offerId: number
  subcategoryId: SubcategoryIdEnum
  onBeforeNavigate: VoidFunction
}) => (
  <TicketCode
    code={code}
    text="Utilises le code ci-dessus pour accéder à ton offre sur le site du partenaire."
    cta={
      <ExternalTouchableLink
        onBeforeNavigate={onBeforeNavigate}
        as={Button}
        wording={getDigitalOfferBookingWording(subcategoryId)}
        icon={ExternalSiteFilledIcon}
        externalNav={{ url: completedUrl, params: { analyticsData: { offerId } } }}
      />
    }
  />
)
