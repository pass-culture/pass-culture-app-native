import React, { useMemo, useCallback } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { SeeMore } from 'features/home/atoms'
import { Layout } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { LocationType } from 'features/search/enums'
import { SearchView } from 'features/search/types'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { VenueOfferTile } from 'features/venue/atoms/VenueOfferTile'
import { analytics } from 'libs/firebase/analytics'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { PassPlaylist } from 'ui/components/PassPlaylist'
import { CustomListRenderItem, RenderFooterItem } from 'ui/components/Playlist'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { MARGIN_DP, Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

interface Props {
  venueId: number
  layout?: Layout
}

const keyExtractor = (item: SearchHit) => item.objectID

export const VenueOffers: React.FC<Props> = ({ venueId, layout = 'one-item-medium' }) => {
  const { data: venue } = useVenue(venueId)
  const { data: venueOffers } = useVenueOffers(venueId)
  const { position } = useGeolocation()
  const params = useVenueSearchParameters(venueId)
  const searchTabNavConfig = useMemo(() => {
    return getTabNavConfig('Search', {
      ...params,
      ...(venue
        ? {
            locationFilter: {
              ...params.locationFilter,
              locationType: LocationType.VENUE,
              venue: {
                ...(params.locationFilter.locationType === LocationType.VENUE
                  ? params.locationFilter.venue
                  : {}),
                label: venue.name,
                info: venue.city || '',
                venueId: venue.id,
              },
            },
          }
        : {}),
      view: SearchView.Results,
    })
  }, [params, venue])
  const searchNavConfig = {
    screen: searchTabNavConfig[0],
    params: searchTabNavConfig[1],
    withPush: true,
  }
  const { hits = [], nbHits = 0 } = venueOffers || {}

  const mapping = useCategoryIdMapping()
  const labelMapping = useCategoryHomeLabelMapping()

  const renderItem: CustomListRenderItem<SearchHit> = useCallback(
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
        />
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position]
  )

  const seeAllOffers = useCallback(() => {
    analytics.logVenueSeeAllOffersClicked(venueId)
  }, [venueId])

  const showSeeMore = nbHits > hits.length
  const onPressSeeMore = showSeeMore ? () => analytics.logVenueSeeMoreClicked(venueId) : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(layout)

  const renderFooter: RenderFooterItem = useCallback(
    ({ width, height }) => (
      <SeeMore
        width={width}
        height={height}
        navigateTo={showSeeMore ? searchNavConfig : undefined}
        onPress={onPressSeeMore as () => void}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onPressSeeMore]
  )

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <React.Fragment></React.Fragment>
  }

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <PassPlaylist
        testID="offersModuleList"
        title="Offres"
        TitleComponent={PlaylistTitle}
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        onPressSeeMore={onPressSeeMore}
        renderItem={renderItem}
        titleSeeMoreLink={showSeeMore ? searchNavConfig : undefined}
        renderFooter={renderFooter}
        keyExtractor={keyExtractor}
      />
      <MarginContainer>
        <TouchableLink
          as={ButtonWithLinearGradient}
          wording="Voir toutes les offres"
          onBeforeNavigate={seeAllOffers}
          navigateTo={searchNavConfig}
        />
      </MarginContainer>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const MarginContainer = styled.View({
  marginHorizontal: PixelRatio.roundToNearestPixel(MARGIN_DP),
})
const PlaylistTitle = styled(Typo.Title4).attrs(getHeadingAttrs(2))``
