import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatBookingAllowedDatetime } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { ShadowWrapper } from 'ui/components/ShadowWrapper'

type AttachedOfferCardProps = {
  offer: Offer
  moduleId: string
  homeEntryId?: string
  backgroundImageUrl?: string
  shouldDisplayBookingAllowedDatetime?: boolean
}

const UnmemoizedMarketingBlockExclusivity = ({
  offer,
  moduleId,
  homeEntryId,
  backgroundImageUrl,
  shouldDisplayBookingAllowedDatetime,
}: AttachedOfferCardProps) => {
  const logConsultOffer = () => {
    triggerConsultOfferLog({
      offerId: parseInt(offer.objectID),
      from: 'home',
      homeEntryId,
      moduleName: offer.offer.name,
      moduleId,
    })
  }
  const bookingAllowedDatetime = offer.offer.bookingAllowedDatetime
  const comingSoon = bookingAllowedDatetime
    ? formatBookingAllowedDatetime({
        bookingAllowedDatetime: new Date(bookingAllowedDatetime * 1000),
        shouldDisplayBookingAllowedDatetime,
      })
    : undefined
  const withGradient = !!comingSoon

  return (
    <MarketingBlock
      navigateTo={{ screen: 'Offer', params: { id: offer.objectID } }}
      onBeforeNavigate={logConsultOffer}
      backgroundImageUrl={backgroundImageUrl}
      withGradient={withGradient}
      AttachedCardComponent={
        <ShadowWrapper>
          <AttachedOfferCard offer={offer} comingSoon={comingSoon} />
        </ShadowWrapper>
      }
    />
  )
}

// Old version: HighlightOfferModule.tsx
export const MarketingBlockExclusivity = memo(UnmemoizedMarketingBlockExclusivity)
