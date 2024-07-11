import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { analytics } from 'libs/analytics'
import { Offer } from 'shared/offer/types'
import { ShadowWrapper } from 'ui/components/ShadowWrapper'

type AttachedOfferCardProps = {
  offer: Offer
  moduleId: string
  homeEntryId?: string
  backgroundImageUrl?: string
}

const UnmemoizedMarketingBlockExclusivity = ({
  offer,
  moduleId,
  homeEntryId,
  backgroundImageUrl,
}: AttachedOfferCardProps) => {
  const logConsultOffer = () => {
    analytics.logConsultOffer({
      offerId: parseInt(offer.objectID),
      from: 'home',
      homeEntryId,
      moduleName: offer.offer.name,
      moduleId,
    })
  }

  return (
    <MarketingBlock
      navigateTo={{ screen: 'Offer', params: { id: offer.objectID } }}
      onBeforeNavigate={logConsultOffer}
      backgroundImageUrl={backgroundImageUrl}
      AttachedCardComponent={
        <ShadowWrapper>
          <AttachedOfferCard offer={offer} />
        </ShadowWrapper>
      }
    />
  )
}

// Old version: HighlightOfferModule.tsx
export const MarketingBlockExclusivity = memo(UnmemoizedMarketingBlockExclusivity)
