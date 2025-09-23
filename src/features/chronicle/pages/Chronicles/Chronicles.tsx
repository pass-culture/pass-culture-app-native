import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { InteractionManager } from 'react-native'

import { SubcategoryIdEnum } from 'api/gen'
import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChroniclesBase } from 'features/chronicle/pages/Chronicles/ChroniclesBase'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { chronicleVariant } from 'features/offer/helpers/chronicleVariant/chronicleVariant'
import { analytics } from 'libs/analytics/provider'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const offerId = route.params?.offerId
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()
  const chronicleVariantInfo =
    chronicleVariant[offer?.subcategoryId ?? SubcategoryIdEnum.LIVRE_PAPIER]
  const { data: chronicleCardsData } = useChronicles<ChronicleCardData[]>({
    offerId,
    select: ({ chronicles }) =>
      offerChroniclesToChronicleCardData(chronicles, chronicleVariantInfo.subtitleItem),
  })

  const handleOnShowRecoButtonPress = () => {
    analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'chronicles',
      categoryName: offer?.subcategoryId
        ? subcategoriesMapping[offer.subcategoryId].categoryId
        : '',
    })
    InteractionManager.runAfterInteractions(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  if (!offer || !chronicleCardsData) return null

  return (
    <ChroniclesBase
      chronicleCardsData={chronicleCardsData}
      offerId={offer.id}
      offerName={offer.name}
      offerCategoryId={subcategoriesMapping[offer.subcategoryId].categoryId}
      variantInfo={chronicleVariantInfo}
      onShowRecoButtonPress={handleOnShowRecoButtonPress}
    />
  )
}
