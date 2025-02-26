import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { chroniclePreviewToChronicalCardData } from 'features/offer/adapters/chroniclePreviewToChronicleCardData'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { useOfferQuery } from 'queries/useOfferQuery/useOfferQuery'

const ANIMATION_DURATION = 700

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const { data: offer, isLoading } = useOfferQuery({ offerId })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()
  const hasOfferChronicleSection = useFeatureFlag(
    RemoteStoreFeatureFlags.WIP_OFFER_CHRONICLE_SECTION
  )

  if (!offer || !subcategories) return null

  if (showSkeleton) return <OfferContentPlaceholder />

  const chronicles = hasOfferChronicleSection
    ? offer.chronicles?.map((value) => chroniclePreviewToChronicalCardData(value))
    : undefined

  return (
    <OfferContent
      offer={offer}
      chronicles={chronicles}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  )
}
