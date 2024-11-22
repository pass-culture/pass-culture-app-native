import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { OfferContentPlaceholder } from 'features/offer/components/OfferContentPlaceholder/OfferContentPlaceholder'
import { useIsFalseWithDelay } from 'libs/hooks/useIsFalseWithDelay'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'
import { UsePerformanceProfilerOptions } from 'shared/performance/types'
import { useFirebasePerformanceProfiler } from 'shared/performance/useFirebasePerformanceProfiler'

const ANIMATION_DURATION = 700

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const { data: offer, isLoading } = useOffer({ offerId })
  const showSkeleton = useIsFalseWithDelay(isLoading, ANIMATION_DURATION)
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()

  useFirebasePerformanceProfiler('Offer', { route } as UsePerformanceProfilerOptions)

  if (!offer || !subcategories) return null

  if (showSkeleton) return <OfferContentPlaceholder />

  return (
    <OfferContent
      offer={offer}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  )
}
