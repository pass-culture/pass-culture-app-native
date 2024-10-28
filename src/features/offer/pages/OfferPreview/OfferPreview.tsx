import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { OfferImageResponse } from 'api/gen'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOffer } from 'features/offer/api/useOffer'
import { getImagesUrls } from 'shared/getImagesUrls/getImagesUrls'
import { ImagesCarousel } from 'ui/components/ImagesCarousel/ImagesCarousel'

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', { id: params.id })
  const { data: offer } = useOffer({ offerId: params.id })

  const defaultIndex = params.defaultIndex ?? 0

  if (!offer?.images) return null

  const images = getImagesUrls<OfferImageResponse>(offer.images)

  return <ImagesCarousel images={images} goBack={goBack} defaultIndex={defaultIndex} />
}
