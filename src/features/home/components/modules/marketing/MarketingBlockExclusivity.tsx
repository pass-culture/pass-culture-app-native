import React, { memo } from 'react'

import { CategoryIdEnum } from 'api/gen'
import { MarketingBlock } from 'features/home/components/modules/marketing/MarketingBlock'
import { useDistance } from 'libs/location/hooks/useDistance'
import { OfferLocation } from 'shared/offer/types'

type AttachedOfferCardProps = {
  title: string
  categoryId: CategoryIdEnum
  offerId: number
  backgroundImageUrl: string
  offerImageUrl?: string
  offerLocation: OfferLocation
  price: string
  categoryText: string
}

const UnmemoizedMarketingBlockExclusivity = ({
  title,
  categoryId,
  offerId,
  backgroundImageUrl,
  offerImageUrl,
  offerLocation,
  price,
  categoryText,
}: AttachedOfferCardProps) => {
  const distanceToOffer = useDistance(offerLocation || { lat: 0, lng: 0 })
  const accessibilityLabel = `Découvre l’offre exclusive "${title}" de la catégorie "${categoryText}" au prix de ${price}. L’offre se trouve à ${distanceToOffer}`

  return (
    <MarketingBlock
      accessibilityLabel={accessibilityLabel}
      navigateTo={{ screen: 'Offer', params: { id: offerId } }}
      backgroundImageUrl={backgroundImageUrl}
      title={title}
      categoryId={categoryId}
      imageUrl={offerImageUrl}
      offerLocation={offerLocation}
      price={price}
      categoryText={categoryText}
      showImage
    />
  )
}

// Old version: HighlightOfferModule.tsx
export const MarketingBlockExclusivity = memo(UnmemoizedMarketingBlockExclusivity)
