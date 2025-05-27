import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistProps } from 'features/gtlPlaylist/components/GtlPlaylist'
import { Referrals, UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferTileWrapper } from 'features/offer/components/OfferTile/OfferTileWrapper'
import { ThematicSearchPlaylist } from 'features/search/pages/ThematicSearch/ThematicSearchPlaylist'
import { Offer } from 'shared/offer/types'
import { CustomListRenderItem } from 'ui/components/Playlist'

type CinemaPlaylistPropsContainingVenue = ThematicSearchPlaylist & {
  venue?: VenueResponse
}

export const useRenderPassPlaylist = ({
  analyticsFrom,
  route,
  playlist,
  venue,
}: Readonly<
  CinemaPlaylistPropsContainingVenue | GtlPlaylistProps
>): CustomListRenderItem<Offer> => {
  const currentRoute = useRoute<UseRouteType<typeof route>>()
  const entryId = 'entryId' in playlist ? playlist.entryId : undefined

  return useCallback(
    ({ item, width, height, index }) => {
      return (
        <OfferTileWrapper
          height={height}
          width={width}
          item={item}
          moduleId={entryId}
          analyticsFrom={analyticsFrom}
          searchId={currentRoute.params?.searchId}
          index={index}
          venueId={venue?.id}
        />
      )
    },
    [analyticsFrom, currentRoute.params?.searchId, venue?.id, entryId]
  )
}

export const renderPassPlaylist = (
  entryId: string,
  analyticsFrom: Referrals,
  searchId: string | undefined,
  venueId: number | undefined
) => {
  const RenderItem = ({ item, width, height, index }) => (
    <OfferTileWrapper
      height={height}
      width={width}
      item={item}
      moduleId={entryId}
      analyticsFrom={analyticsFrom}
      searchId={searchId}
      index={index}
      venueId={venueId}
    />
  )
  return RenderItem
}
