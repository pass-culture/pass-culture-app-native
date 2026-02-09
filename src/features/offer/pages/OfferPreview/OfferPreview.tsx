import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseRouteType } from 'features/navigation/navigators/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useOfferQuery } from 'queries/offer/useOfferQuery'
import { getImagesUrlsWithCredit } from 'shared/getImagesUrlsWithCredit/getImagesUrlsWithCredit'
import { ImageWithCredit } from 'shared/types'
import { ImagesCarousel } from 'ui/components/ImagesCarousel/ImagesCarousel'

export const OfferPreview: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'OfferPreview'>>()
  const { goBack } = useGoBack('Offer', { id: params.id })
  const { data: offer } = useOfferQuery({ offerId: params.id })

  const defaultIndex = params.defaultIndex ?? 0

  if (!offer?.images) return null

  const images = getImagesUrlsWithCredit<ImageWithCredit>(offer.images)

  return (
    <ImagesCarousel
      images={images.map((image) => image.url)}
      goBack={goBack}
      defaultIndex={defaultIndex}
    />
  )
}
