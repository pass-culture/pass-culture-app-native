import React from 'react'

import { useAuthContext } from 'features/auth/context/AuthContext'
import { useHomeRecommendedOffers } from 'features/home/api/useHomeRecommendedOffers'
import { RecommendedOffersModule } from 'features/home/types'
import { useUserLocation } from 'libs/locationV2/location.store'
import { VerticalPlaylistOffersView } from 'shared/verticalPlaylist/components/VerticalPlaylistOffersView'

type Props = { module: RecommendedOffersModule }

export const VerticalPlaylistRecommendedOffers = ({ module }: Props) => {
  const position = useUserLocation()
  const { user: profile } = useAuthContext()
  const { offers } = useHomeRecommendedOffers(
    position,
    module.id,
    module.recommendationParameters,
    profile?.id
  )

  return (
    <VerticalPlaylistOffersView
      title={module.displayParameters.title}
      items={offers}
      analyticsFrom="verticalplaylistoffers"
    />
  )
}
