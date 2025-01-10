import React, { memo } from 'react'

import { AttachedOfferCard } from 'features/home/components/AttachedModuleCard/AttachedOfferCard'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { formatToReadableFrenchDate } from 'libs/dates'
import { Offer } from 'shared/offer/types'
import { ShadowWrapper } from 'ui/components/ShadowWrapper'

type AttachedOfferCardProps = {
  offer: Offer
  moduleId: string
  homeEntryId?: string
  backgroundImageUrl?: string
  shouldDisplayPublicationDate?: boolean
  publicationDate?: Date
}

const UnmemoizedMarketingBlockExclusivity = ({
  offer,
  moduleId,
  homeEntryId,
  backgroundImageUrl,
  shouldDisplayPublicationDate,
  publicationDate,
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

  const comingSoonText =
    publicationDate && shouldDisplayPublicationDate
      ? `Disponible le ${formatToReadableFrenchDate(publicationDate)}`
      : 'Bientôt disponible'

  const comingSoon =
    publicationDate && new Date().getTime() < publicationDate.getTime() ? comingSoonText : undefined

  return (
    <MarketingBlock
      navigateTo={{ screen: 'Offer', params: { id: offer.objectID } }}
      onBeforeNavigate={logConsultOffer}
      backgroundImageUrl={backgroundImageUrl}
      comingSoon={comingSoon}
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
