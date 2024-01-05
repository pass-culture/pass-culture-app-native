import { useRoute } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { useIsFetching } from 'react-query'
import styled from 'styled-components/native'

import { VenueResponse, VenueTypeCodeKey } from 'api/gen'
import { GTLPlaylistResponse } from 'features/gtlPlaylist/api/gtlPlaylistApi'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { useGTLPlaylists } from 'features/gtlPlaylist/hooks/useGTLPlaylists'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { NoOfferPlaceholder } from 'features/venue/components/VenueOffers/NoOfferPlaceholder'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics'
import { getPlaylistItemDimensionsFromLayout } from 'libs/contentful/dimensions'
import { Layout } from 'libs/contentful/types'
import { useLocation } from 'libs/location'
import { formatDates, getDisplayPrice, VenueTypeCode } from 'libs/parsers'
import { QueryKeys } from 'libs/queryKeys'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venue: VenueResponse
  layout?: Layout
  venueOffers?: { hits: Offer[]; nbHits: number }
  playlists?: GTLPlaylistResponse
}

const keyExtractor = (item: Offer) => item.objectID

export function VenueOffersNew({
  venue,
  layout = 'two-items',
  venueOffers,
  playlists,
}: Readonly<Props>) {
  const { geolocPosition } = useLocation()
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)
  const isVenueOfferFetching = useIsFetching(QueryKeys.VENUE_OFFERS)
  const { isLoading: arePlaylistsLoading } = useGTLPlaylists({ venue })

  const { hits = [], nbHits = 0 } = venueOffers ?? {}

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<Offer> = useCallback(
    ({ item, width, height }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      return (
        <VenueOfferTile
          categoryLabel={labelMapping[item.offer.subcategoryId]}
          categoryId={mapping[item.offer.subcategoryId]}
          subcategoryId={item.offer.subcategoryId}
          offerId={+item.objectID}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          venueId={venue?.id}
          width={width}
          height={height}
          searchId={routeParams?.searchId}
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [geolocPosition]
  )

  const shouldDisplayGtlPlaylist =
    [VenueTypeCodeKey.DISTRIBUTION_STORE, VenueTypeCodeKey.BOOKSTORE].includes(
      venue?.venueTypeCode as VenueTypeCode
    ) && !!playlists?.length

  const showSeeMore = nbHits > hits.length && !shouldDisplayGtlPlaylist
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venue.id) : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(layout)

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }: { width: number; height: number }) => (
      <SeeMore
        width={width}
        height={height}
        navigateTo={showSeeMore ? searchNavConfig : undefined}
        onPress={() => analytics.logVenueSeeMoreClicked(venue.id)}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPressSeeMore]
  )

  if (isVenueOfferFetching || arePlaylistsLoading) return null

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <NoOfferPlaceholder />
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Toutes les offres"
        TitleComponent={PlaylistTitleText}
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      {shouldDisplayGtlPlaylist ? (
        <React.Fragment>
          {playlists.slice(0, 10).map((playlist) => (
            <GtlPlaylist key={playlist.title} venue={venue} playlist={playlist} />
          ))}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(Typo.Title3).attrs(getHeadingAttrs(2))``
