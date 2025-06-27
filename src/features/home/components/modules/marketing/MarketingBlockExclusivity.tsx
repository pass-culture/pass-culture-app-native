import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatPublicationDate } from 'libs/parsers/formatDates'
import { Offer } from 'shared/offer/types'
import { ShadowWrapper } from 'ui/components/ShadowWrapper'

type AttachedOfferCardProps = {
  offer: Offer
  moduleId: string
  homeEntryId?: string
  backgroundImageUrl?: string
  shouldDisplayPublicationDate?: boolean
}

const UnmemoizedMarketingBlockExclusivity = ({
  offer,
  moduleId,
  homeEntryId,
  backgroundImageUrl,
  shouldDisplayPublicationDate,
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
  const publicationDate = offer.offer.publicationDate
  const comingSoon = publicationDate
    ? formatPublicationDate({
        publicationDate: new Date(publicationDate * 1000),
        shouldDisplayPublicationDate,
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
