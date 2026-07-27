import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { clubAdvicesToAdviceCardData } from 'features/clubAdvices/adapters/clubAdvicesToAdviceCardData/clubAdvicesToAdviceCardData'
import { useClubAdviceVariant } from 'features/clubAdvices/helpers/useClubAdviceVariant'
import { ClubAdvicesBase } from 'features/clubAdvices/pages/ClubAdvices/ClubAdvicesBase'
import { useClubAdvicesQuery } from 'features/clubAdvices/queries/useClubAdvicesQuery'
import { UseNavigationType, UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { runAfterInteractionsMobile } from 'shared/runAfterInteractionsMobile/runAfterInteractionsMobile'

export const ClubAdvices: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ClubAdvices'>>()
  const { navigate } = useNavigation<UseNavigationType>()

  const offerId = route.params?.offerId
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()
  const adviceVariantInfo = useClubAdviceVariant(offer?.subcategoryId)
  const { data: clubAdvices } = useClubAdvicesQuery({
    offerId,
    enabled: !!adviceVariantInfo,
  })

  const handleOnShowRecoButtonPress = () => {
    void analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'chronicles',
      categoryName: offer?.subcategoryId
        ? subcategoriesMapping[offer.subcategoryId].categoryId
        : '',
    })
    runAfterInteractionsMobile(() => {
      navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
    })
  }

  if (!offer || !clubAdvices || !adviceVariantInfo) return null

  const adviceCardsData = clubAdvicesToAdviceCardData(
    clubAdvices.chronicles,
    adviceVariantInfo.subtitleItem
  )

  return (
    <ClubAdvicesBase
      adviceCardsData={adviceCardsData}
      offerId={offer.id}
      offerName={offer.name}
      offerCategoryId={subcategoriesMapping[offer.subcategoryId].categoryId}
      variantInfo={adviceVariantInfo}
      onShowRecoButtonPress={handleOnShowRecoButtonPress}
    />
  )
}
