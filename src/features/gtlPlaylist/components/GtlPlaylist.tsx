import { Hit } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

interface GtlPlaylistProps {
  venue: VenueResponse
  playlist: GTLPlaylistResponse[number]
}

export function GtlPlaylist({ venue, playlist }: GtlPlaylistProps) {
  const transformOfferHits = useTransformOfferHits()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const route = useRoute<UseRouteType<'Venue'>>()
  const entryId = playlist.entryId

  const renderPassPlaylist: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height, index }) => {
      const hit = transformOfferHits(item)
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)

      return (
        <VenueOfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+hit.objectID}
          name={hit.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={hit.offer.isDuo}
          thumbUrl={hit.offer.thumbUrl}
          price={getDisplayPrice(hit.offer.prices)}
          venueId={venue?.id}
          width={width}
          height={height}
          searchId={route.params?.searchId}
          moduleId={entryId}
          index={index}
        />
      )
    },
    [entryId, labelMapping, mapping, route.params?.searchId, transformOfferHits, venue?.id]
  )

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(playlist.layout)

  return (
    <PassPlaylist
      data={playlist.offers.hits}
      itemWidth={itemWidth}
      itemHeight={itemHeight}
      renderItem={renderPassPlaylist}
      keyExtractor={(item: Hit<Offer>) => item.offer.name ?? ''}
      title={playlist.title}
    />
  )
}
