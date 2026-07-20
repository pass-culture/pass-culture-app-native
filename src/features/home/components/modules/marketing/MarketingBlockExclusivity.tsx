import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatBookingAllowedDatetime } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { AB_TESTS } from 'shared/useABSegment/abTests'
import { useABSegment } from 'shared/useABSegment/useABSegment'
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
  const proAdvicesOnOfferSegment = useABSegment(AB_TESTS.PRO_REVIEWS_ON_OFFER)
  const logConsultOffer = () => {
    triggerConsultOfferLog({
      offerId: Number.parseInt(offer.objectID),
      venueId: offer.venue.id,
      from: 'home',
      homeEntryId,
      moduleName: offer.offer.name,
      moduleId,
      displayAdvice: proAdvicesOnOfferSegment === 'A',
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
