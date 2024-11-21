import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'

import { VenueResponse } from 'api/gen'
import { GtlPlaylistProps } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { OfferTile } from 'features/offer/components/OfferTile/OfferTile'
import { CinemaPlaylistProps } from 'features/search/pages/Search/ThematicSearch/ThematicSearchPlaylist'
import { useTransformOfferHits } from 'libs/algolia/fetchAlgolia/transformOfferHit'
import { useFeatureFlag } from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { useCategoryHomeLabelMapping, useCategoryIdMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { CustomListRenderItem } from 'ui/components/Playlist'

type CinemaPlaylistPropsContainingVenue = CinemaPlaylistProps & {
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
  const transformOfferHits = useTransformOfferHits()
  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()
  const currentRoute = useRoute<UseRouteType<typeof route>>()
  const isNewOfferTileOnCinemaDisplayed =
    useFeatureFlag(RemoteStoreFeatureFlags.WIP_NEW_OFFER_TILE) || currentRoute.name == 'Venue'
  const entryId = 'entryId' in playlist ? playlist.entryId : undefined

  return useCallback(
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
          venueId={venue?.id}
          moduleId={entryId}
          variant={isNewOfferTileOnCinemaDisplayed ? 'new' : 'default'}
        />
      )
    },
    [
      transformOfferHits,
      analyticsFrom,
      labelMapping,
      mapping,
      currentRoute.params?.searchId,
      venue?.id,
      entryId,
      isNewOfferTileOnCinemaDisplayed,
    ]
  )
}
