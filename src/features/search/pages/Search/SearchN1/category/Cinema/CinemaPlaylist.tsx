import { Hit } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { Referrals, UseRouteType, ScreenNames } from 'features/navigation/RootNavigator/types'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { CinemaPlaylistData } from 'features/search/pages/Search/SearchN1/category/Cinema/algolia/useCinemaOffers'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'
import { LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

interface CinemaPlaylistProps {
  playlist: CinemaPlaylistData
  analyticsFrom: Referrals
  route: Extract<ScreenNames, 'SearchN1'>
}

const PLAYLIST_ITEM_HEIGHT = LENGTH_M
const PLAYLIST_ITEM_WIDTH = LENGTH_M * RATIO_HOME_IMAGE

export function CinemaPlaylist({ playlist, analyticsFrom, route }: Readonly<CinemaPlaylistProps>) {
  const transformOfferHits = useTransformOfferHits()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const currentRoute = useRoute<UseRouteType<typeof route>>()

  const renderPassPlaylist: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height, index }) => {
      const hit = transformOfferHits(item)
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)

      return (
        <OfferTile
          analyticsFrom={analyticsFrom}
          offerLocation={item._geoloc}
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+hit.objectID}
          name={hit.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={hit.offer.isDuo}
          thumbUrl={hit.offer.thumbUrl}
          price={getDisplayPrice(hit.offer.prices)}
          width={width}
          height={height}
          searchId={currentRoute.params?.searchId}
          index={index}
          variant="new"
        />
      )
    },
    [labelMapping, mapping, currentRoute.params?.searchId, transformOfferHits, analyticsFrom]
  )

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
