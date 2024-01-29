import { Hit } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useLogScrollHandler } from 'features/offerv2/helpers/useLogScrolHandler/useLogScrollHandler'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { useFunctionOnce } from 'libs/hooks'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

interface GtlPlaylistProps {
  venue: VenueResponse
  playlist: GTLPlaylistResponse[number]
}

export function GtlPlaylist({ venue, playlist }: Readonly<GtlPlaylistProps>) {
  const transformOfferHits = useTransformOfferHits()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const route = useRoute<UseRouteType<'Venue'>>()
  const entryId = playlist.entryId

  const logHasSeenAllTilesOnce = useFunctionOnce(() => {
    analytics.logAllTilesSeen({
      moduleId: entryId,
      numberOfTiles: playlist.offers.hits.length,
      venueId: venue.id,
    })
  })

  const logModuleDisplayedOnce = useFunctionOnce(() => {
    analytics.logModuleDisplayed({ moduleId: entryId, displayedOn: 'venue', venueId: venue.id })
  })

  const handleLogModuleDisplayedScrolling = useLogScrollHandler(logModuleDisplayedOnce)

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
    <IntersectionObserver
      onChange={handleLogModuleDisplayedScrolling}
      threshold="50%"
      key={playlist.entryId}>
      <PassPlaylist
        data={playlist.offers.hits}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        renderItem={renderPassPlaylist}
        keyExtractor={(item: Hit<Offer>) => {
          const hit = transformOfferHits(item)
          return hit.objectID ?? ''
        }}
        title={playlist.title}
        onEndReached={logHasSeenAllTilesOnce}
      />
    </IntersectionObserver>
  )
}
