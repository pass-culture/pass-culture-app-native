import React from 'react'

import { PageNotFound } from 'features/navigation/pages/PageNotFound'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/getPlaylistItemDimensionsFromLayout'
import { useLocation } from 'libs/location'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { OfferPlaylistSkeleton, TileSize } from 'ui/components/placeholders/OfferPlaylistSkeleton'

import { OfferNearMe } from '../../components/OfferNearMe'
import { useOffersNearMeQuery } from '../../queries/useOffersNearMeQuery'

export const NearMeContainer = () => {
  const { userLocation } = useLocation()
  const { data, status } = useOffersNearMeQuery(userLocation)

  switch (status) {
    case 'loading':
      return <OfferPlaylistSkeleton size={TileSize.MEDIUM} numberOfTiles={5} />

    case 'success': {
      const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout('two-items')

      return (
        <PassPlaylist
          data={data}
          itemWidth={itemWidth}
          itemHeight={itemHeight}
          renderItem={OfferNearMe}
          keyExtractor={(item) => item.objectID}
          title="Les offres autour de moi"
        />
      )
    }

    case 'error':
      return <PageNotFound />
  }
}
