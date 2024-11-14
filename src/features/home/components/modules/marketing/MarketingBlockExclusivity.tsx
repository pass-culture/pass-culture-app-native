import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useFunctionOnce } from 'libs/hooks'
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
  const triggerConsultOfferLogOnce = useFunctionOnce(() =>
    triggerConsultOfferLog({
      offerId: parseInt(offer.objectID),
      from: 'home',
      homeEntryId,
      moduleName: offer.offer.name,
      moduleId,
    })
  )

  return (
    <MarketingBlock
      navigateTo={{ screen: 'Offer', params: { id: offer.objectID } }}
      onBeforeNavigate={triggerConsultOfferLogOnce}
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
