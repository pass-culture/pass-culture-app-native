import { Hit } from '@algolia/client-search'
import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistData } from 'features/gtlPlaylist/types'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { useLogScrollHandler } from 'features/offer/helpers/useLogScrolHandler/useLogScrollHandler'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { analytics } from 'libs/analytics'
import { usePlaylistItemDimensionsFromLayout } from 'libs/contentful/usePlaylistItemDimensionsFromLayout'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useFunctionOnce } from 'libs/hooks'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { IntersectionObserver } from 'shared/IntersectionObserver/IntersectionObserver'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem } from 'ui/components/Playlist'

export interface GtlPlaylistProps {
  venue: VenueResponse
  playlist: GtlPlaylistData
}

export function GtlPlaylist({ venue, playlist }: Readonly<GtlPlaylistProps>) {
  const isNewOfferTileDisplayed = useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE)
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
          variant={isNewOfferTileDisplayed ? 'new' : 'default'}
        />
      )
    },
    [
      entryId,
      labelMapping,
      mapping,
      route.params?.searchId,
      transformOfferHits,
      venue?.id,
      isNewOfferTileDisplayed,
    ]
  )

  const { itemWidth, itemHeight } = usePlaylistItemDimensionsFromLayout(playlist.layout)

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
        keyExtractor={(item: Hit<Offer>) => transformOfferHits(item).objectID}
        title={playlist.title}
        onEndReached={logHasSeenAllTilesOnce}
      />
    </IntersectionObserver>
  )
}
