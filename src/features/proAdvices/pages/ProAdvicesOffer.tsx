import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { useOfferProAdvicesQuery } from 'features/advices/queries/useOfferProAdvicesQuery'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { offerProAdvicesToAdviceCardData } from 'features/proAdvices/adapters/offerProAdvicesToAdviceCardData/offerProAdvicesToAdviceCardData'
import { ProAdvicesBase } from 'features/proAdvices/pages/ProAdvicesBase'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/LocationWrapper'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const ProAdvicesOffer: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'ProAdvicesOffer'>>()
  const { offerId, venueId } = route.params
  const enableProAdvices = useFeatureFlag(RemoteStoreFeatureFlags.WIP_PRO_REVIEWS_OFFER)

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

  if (!offer) return null

  const title = `Tous les avis sur “${offer.name}”`

  return <ProAdvicesBase title={title} advices={advices ?? []} goBack={goBack} id={venueId} />
}
