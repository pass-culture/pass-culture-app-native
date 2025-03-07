import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { offerChroniclesToChronicleCardData } from 'features/chronicle/adapters/offerChroniclesToChronicleCardData/offerChroniclesToChronicleCardData'
import { useChronicles } from 'features/chronicle/api/useChronicles/useChronicles'
import { ChroniclesBase } from 'features/chronicle/pages/Chronicles/ChroniclesBase'
import { ChronicleCardData } from 'features/chronicle/type'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const Chronicles: FunctionComponent = () => {
  const route = useRoute<UseRouteType<'Chronicles'>>()
  const offerId = route.params?.offerId
  const { data: offer } = useOfferQuery({ offerId })
  const { data: chronicleCardsData } = useChronicles<ChronicleCardData[]>({
    offerId,
    select: ({ chronicles }) => offerChroniclesToChronicleCardData(chronicles),
  })

  if (!offer || !chronicleCardsData) return null

  return (
    <ChroniclesBase
      chronicleCardsData={chronicleCardsData}
      offerId={offer.id}
      offerName={offer.name}
    />
  )
}
