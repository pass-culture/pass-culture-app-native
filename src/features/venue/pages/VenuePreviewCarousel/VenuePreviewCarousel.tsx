import { useRoute } from '@react-navigation/native'
import React, { FunctionComponent } from 'react'

import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useGoBack } from 'features/navigation/useGoBack'
import { useVenue } from 'features/venue/api/useVenue'
import { ImagesCarousel } from 'ui/components/ImagesCarousel/ImagesCarousel'

export const VenuePreviewCarousel: FunctionComponent = () => {
  const { params } = useRoute<UseRouteType<'VenuePreviewCarousel'>>()
  const { goBack } = useGoBack('Venue', { id: params.id })
  const { data: venue } = useVenue(params.id)

  const defaultIndex = params.defaultIndex ?? 0

  if (!venue?.bannerUrl) return null

  const images = [venue.bannerUrl]

  return <ImagesCarousel images={images} goBack={goBack} defaultIndex={defaultIndex} />
}
