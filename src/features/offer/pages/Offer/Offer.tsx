import { useRoute } from '@react-navigation/native'
import React, { useState } from 'react'

import { useQueryClient } from '__mocks__/react-query'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOffer } from 'features/offer/api/useOffer'
import { OfferContentOld } from 'features/offer/components/OfferContentOld/OfferContentOld'
import { OfferContent } from 'features/offerv2/components/OfferContent/OfferContent'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { eventMonitoring } from 'libs/monitoring'
import { QueryKeys } from 'libs/queryKeys'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { Subcategory } from 'libs/subcategories/types'
import { useSubcategories } from 'libs/subcategories/useSubcategories'

export function Offer() {
  const route = useRoute<UseRouteType<'Offer'>>()
  const offerId = route.params?.id

  const { data: offer } = useOffer({ offerId })
  const { data: subcategories } = useSubcategories()
  const subcategoriesMapping = useSubcategoriesMapping()

  const shouldDisplayOfferV2 = useFeatureFlag(RemoteStoreFeatureFlags.WIP_OFFER_V2)
  const queryClient = useQueryClient()

  const [refetchDone, setRefetchDone] = useState(false)

  const fetchData = () => {
    console.log('je passe')
    queryClient.invalidateQueries(QueryKeys.SUBCATEGORIES)
    setRefetchDone(true)
  }

  if (!offer || !subcategories) return null

  const subcategory: Subcategory = subcategoriesMapping[offer.subcategoryId]

  if (!subcategoriesMapping[offer.subcategoryId] && !refetchDone) {
    fetchData()
  }

  if (!subcategory) {
    eventMonitoring.captureException('Subcategory not found', {
      extra: {
        subcategoryId: offer.subcategoryId,
        subcategories: subcategories.subcategories,
      },
    })

    throw new Error('Subcategory not found')
  }

  return shouldDisplayOfferV2 ? (
    <OfferContent
      offer={offer}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  ) : (
    <OfferContentOld
      offer={offer}
      offerNativeCategory={subcategory.nativeCategoryId}
      offerSearchGroup={subcategory.searchGroupName}
      searchGroupList={subcategories.searchGroups}
      subcategory={subcategoriesMapping[offer.subcategoryId]}
    />
  )
}

// export function Offer() {
//   const route = useRoute<UseRouteType<'Offer'>>()
//   const offerId = route.params?.id

//   const { data: offer } = useOffer({ offerId })
//   const { data: subcategories, refetch } = useSubcategories()
//   const subcategoriesMapping = useSubcategoriesMapping()

//   const [refetchDone, setRefetchDone] = useState(false)

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!subcategoriesMapping[offer.subcategoryId]) {
//         console.log('je passe')
//         await refetch()
//         setRefetchDone(true)
//       }
//     }

//     fetchData()
//   }, [subcategoriesMapping, refetch, offer.subcategoryId])

//   if (!offer || !subcategories) return null

//   const subcategory: Subcategory = subcategoriesMapping[offer.subcategoryId]

//   if (refetchDone) {
//     eventMonitoring.captureException('Subcategory not found', {
//       extra: {
//         subcategoryId: offer.subcategoryId,
//         subcategories: subcategories.subcategories,
//       },
//     })

//     throw new Error('Subcategory not found')
//   }

//   return (
//     <OfferContent
//       offer={offer}
//       offerNativeCategory={subcategory.nativeCategoryId}
//       offerSearchGroup={subcategory.searchGroupName}
//       searchGroupList={subcategories.searchGroups}
//     />
//   )
// }

// L'idée était d'avoir une seule invalidation de cache si jamais on ne trouve pas de concordance avec la sous-catégorie de l'offre qu'on souhaite afficher
