import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { SubcategoryIdEnum, SubcategoryIdEnumv2 } from 'api/gen'
import { AdvicesOfferColumn } from 'features/advices/components/AdvicesOfferColumn/AdvicesOfferColumn.web'
import { AdviceCardData } from 'features/advices/types'
import { clubAdvicesToAdviceCardData } from 'features/clubAdvices/adapters/clubAdvicesToAdviceCardData/clubAdvicesToAdviceCardData'
import { clubAdviceVariant } from 'features/clubAdvices/helpers/clubAdviceVariant'
import { ClubAdvicesBase } from 'features/clubAdvices/pages/ClubAdvices/ClubAdvicesBase'
import { useClubAdvicesQuery } from 'features/clubAdvices/queries/useClubAdvicesQuery'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { analytics } from 'libs/analytics/provider'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const ClubAdvices: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ClubAdvices'>>()
  const offerId = route.params?.offerId
  const { navigate } = useNavigation<UseNavigationType>()
  const { data: offer } = useOfferQuery({ offerId })
  const subcategoriesMapping = useSubcategoriesMapping()
  const adviceVariantInfo =
    clubAdviceVariant[offer?.subcategoryId ?? SubcategoryIdEnum.LIVRE_PAPIER]
  const { data: adviceCardsData } = useClubAdvicesQuery<AdviceCardData[]>({
    offerId,
    select: ({ chronicles: advices }) =>
      clubAdvicesToAdviceCardData(advices, adviceVariantInfo.subtitleItem),
  })

  const subcategory = offer
    ? subcategoriesMapping[offer.subcategoryId]
    : subcategoriesMapping[SubcategoryIdEnumv2.CONCERT]

  const onPress = () => {
    navigate('Offer', { id: offerId, from: 'chronicles' })
  }

  const handleOnShowRecoButtonPress = () => {
    analytics.logClickAllClubRecos({
      offerId: offerId.toString(),
      from: 'chronicles',
      categoryName: offer?.subcategoryId
        ? subcategoriesMapping[offer.subcategoryId].categoryId
        : '',
    })
    navigate('ThematicHome', { homeId: '4mlVpAZySUZO6eHazWKZeV', from: 'chronicles' })
  }

  if (!offer || !adviceCardsData) return null

  return (
    <Container>
      <ClubAdvicesBase
        offerId={offer.id}
        offerName={offer.name}
        offerCategoryId={subcategory.categoryId}
        variantInfo={adviceVariantInfo}
        adviceCardsData={adviceCardsData}
        onShowRecoButtonPress={handleOnShowRecoButtonPress}>
        <AdvicesOfferColumn
          offer={offer}
          subcategoriesMapping={subcategoriesMapping}
          subcategory={subcategory}
          onPress={onPress}
        />
      </ClubAdvicesBase>
    </Container>
  )
}

const FullFlexView = styled.View({
  flex: 1,
})

const Container = styled(FullFlexView)(({ theme }) => ({
  ...(theme.isDesktopViewport
    ? {
        paddingHorizontal: theme.contentPage.marginHorizontal,
        paddingTop: theme.contentPage.marginVertical,
      }
    : {}),
}))
