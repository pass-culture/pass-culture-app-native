import { useNavigation, useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'
import { styled } from 'styled-components/native'

import { SubcategoryIdEnumv2 } from 'api/gen'
import { AdvicesOfferColumn } from 'features/advices/components/AdvicesOfferColumn/AdvicesOfferColumn.web'
import { useOfferProAdvicesQuery } from 'features/advices/queries/useOfferProAdvicesQuery'
import { UseNavigationType, UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { offerProAdvicesToAdviceCardData } from 'features/proAdvices/adapters/offerProAdvicesToAdviceCardData/offerProAdvicesToAdviceCardData'
import { ProAdvicesBase } from 'features/proAdvices/pages/ProAdvicesBase'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const ProAdvicesOffer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ProAdvicesOffer'>>()
  const { navigate } = useNavigation<UseNavigationType>()
  const { offerId, venueId } = route.params
  const enableProAdvices = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_OFFER)

  const subcategoriesMapping = useSubcategoriesMapping()

  const { userLocation } = useLocation()
  const { data: offer } = useOfferQuery({ offerId })
  const { data: advices } = useOfferProAdvicesQuery({
    offerId,
    enableProAdvices,
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    select: ({ proAdvices }) => offerProAdvicesToAdviceCardData(proAdvices),
  })

  const { goBack } = useGoBack('Offer')

  const subcategory = offer
    ? subcategoriesMapping[offer.subcategoryId]
    : subcategoriesMapping[SubcategoryIdEnumv2.CONCERT]

  const onPress = () => {
    navigate('Offer', { id: offerId, from: 'chronicles' })
  }

  if (!offer) return null

  const title = `Tous les avis sur “${offer.name}”`

  return (
    <Container>
      <ProAdvicesBase title={title} advices={advices ?? []} goBack={goBack} id={venueId}>
        <AdvicesOfferColumn
          offer={offer}
          subcategoriesMapping={subcategoriesMapping}
          subcategory={subcategory}
          onPress={onPress}
        />
      </ProAdvicesBase>
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
