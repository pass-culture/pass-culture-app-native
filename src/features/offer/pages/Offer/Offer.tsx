import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferContent } from 'features/offer/components/OfferContent/OfferContent'
import { getSearchGroupAndNativeCategoryFromSubcategoryId } from 'features/offer/helpers/getSearchGroupAndNativeCategoryFromSubcategoryId/getSearchGroupAndNativeCategoryFromSubcategoryId'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const { data: offer } = useOffer({ offerId })
  const { data: subcategories } = useSubcategories()

  if (!offer || !subcategories) return null

  const { searchGroupName, nativeCategory } = getSearchGroupAndNativeCategoryFromSubcategoryId(
    subcategories,
    offer.subcategoryId
  )

  return (
    <OfferContent
      offer={offer}
      offerNativeCategory={nativeCategory}
      offerSearchGroup={searchGroupName}
      searchGroupList={subcategories.searchGroups}
    />
  )
}
