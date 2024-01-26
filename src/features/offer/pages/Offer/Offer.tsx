import { useRoute } from '@react-navigation/native'
import React from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferContentOld } from 'features/offer/components/OfferContentOld/OfferContentOld'
import { getSearchGroupAndNativeCategoryFromSubcategoryId } from 'features/offer/helpers/getSearchGroupAndNativeCategoryFromSubcategoryId/getSearchGroupAndNativeCategoryFromSubcategoryId'
import { OfferContent } from 'features/offerv2/components/OfferContent/OfferContent'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useSubcategoriesMapping } from 'libs/subcategories/mappings'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const { data: offer } = useOffer({ offerId })
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()

  const shouldDisplayOfferV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_V2)

  if (!offer || !subcategories) return null

  const { searchGroupName, nativeCategory } = getSearchGroupAndNativeCategoryFromSubcategoryId(
    subcategories,
    offer.subcategoryId
  )

  return shouldDisplayOfferV2 ? (
    <OfferContent
      offer={offer}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  ) : (
    <OfferContentOld
      offer={offer}
      offerNativeCategory={nativeCategory}
      offerSearchGroup={searchGroupName}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  )
}
