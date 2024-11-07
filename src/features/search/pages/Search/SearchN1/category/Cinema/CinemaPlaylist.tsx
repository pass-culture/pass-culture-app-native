import { Hit } from '@algolia/client-search'
import React from 'react'

import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { CinemaPlaylistData } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/useCinemaOffers'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { Offer } from 'shared/offer/types'
import { useRenderPassPlaylist } from 'shared/renderPassPlaylist'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

const PLAYLIST_ITEM_HEIGHT = LENGTH_M
const PLAYLIST_ITEM_WIDTH = LENGTH_M * RATIO_HOME_IMAGE
export interface CinemaPlaylistProps {
  playlist: CinemaPlaylistData
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'ThematicSearch'>
}

export function CinemaPlaylist({ playlist, analyticsFrom, route }: Readonly<CinemaPlaylistProps>) {
  const renderPassPlaylist = useRenderPassPlaylist({ analyticsFrom, route, playlist })
  const transformOfferHits = useTransformOfferHits()
  return (
    <PassPlaylist
      data={playlist.offers.hits}
      itemWidth={PLAYLIST_ITEM_WIDTH}
      itemHeight={PLAYLIST_ITEM_HEIGHT}
      renderItem={renderPassPlaylist}
      keyExtractor={(item: Hit<Offer>) => transformOfferHits(item).objectID}
      title={playlist.title}
    />
  )
}
