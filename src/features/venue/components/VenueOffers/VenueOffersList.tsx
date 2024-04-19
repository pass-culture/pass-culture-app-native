import { useRoute } from '@react-navigation/native'
import React from 'react'
import styled from 'styled-components/native'

import { VenueTypeCodeKey } from 'api/gen'
import { GtlPlaylist } from 'features/gtlPlaylist/components/GtlPlaylist'
import { UseRouteType } from 'features/navigation/RootNavigator/types'
import { VenueOffersProps } from 'features/venue/components/VenueOffers/VenueOffers'
import { VenueOfferTile } from 'features/venue/components/VenueOfferTile/VenueOfferTile'
import { useNavigateToSearchWithVenueOffers } from 'features/venue/helpers/useNavigateToSearchWithVenueOffers'
import { analytics } from 'libs/analytics'
import { formatDates } from 'libs/parsers/formatDates'
import { getDisplayPrice } from 'libs/parsers/getDisplayPrice'
import { VenueTypeCode } from 'libs/parsers/venueType'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { Offer } from 'shared/offer/types'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { SeeMore } from 'ui/components/SeeMore'
import { LENGTH_M, RATIO_HOME_IMAGE, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const keyExtractor = (item: Offer) => item.objectID

export const VenueOffersList: React.FC<VenueOffersProps> = ({ venue, venueOffers, playlists }) => {
  const { params: routeParams } = useRoute<UseRouteType<'Offer'>>()
  const searchNavConfig = useNavigateToSearchWithVenueOffers(venue)

  const { hits = [], nbHits = 0 } = venueOffers ?? {}

  const shouldDisplayGtlPlaylist =
    [VenueTypeCodeKey.DISTRIBUTION_STORE, VenueTypeCodeKey.BOOKSTORE].includes(
      venue?.venueTypeCode as VenueTypeCode
    ) && !!playlists?.length

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const showSeeMore = nbHits > hits.length && !shouldDisplayGtlPlaylist
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venue.id) : undefined

  const renderFooter: RenderFooterItem = ({ width, height }: { width: number; height: number }) => (
    <SeeMore
      width={width}
      height={height}
      navigateTo={showSeeMore ? searchNavConfig : undefined}
      onPress={() => analytics.logVenueSeeMoreClicked(venue.id)}
    />
  )
  const renderItem: CustomListRenderItem<Offer> = ({ item, width, height }) => {
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
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Toutes les offres"
        TitleComponent={PlaylistTitleText}
        data={hits}
        itemHeight={LENGTH_M}
        itemWidth={LENGTH_M * RATIO_HOME_IMAGE}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      {shouldDisplayGtlPlaylist ? (
        <React.Fragment>
          {playlists.map((playlist) => (
            <GtlPlaylist key={playlist.entryId} venue={venue} playlist={playlist} />
          ))}
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}

const PlaylistTitleText = styled(Typo.Title3).attrs(getHeadingAttrs(2))``
