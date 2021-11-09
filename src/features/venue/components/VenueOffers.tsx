import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { PixelRatio } from 'react-native'
import styled from 'styled-components/native'

import { CustomListRenderItem, Playlist } from 'features/home/components/Playlist'
import { Layout } from 'features/home/contentful'
import { getPlaylistItemDimensionsFromLayout } from 'features/home/contentful/dimensions'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { getTabNavConfig } from 'features/navigation/TabBar/helpers'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { useVenueSearchParameters } from 'features/venue/api/useVenueSearchParameters'
import { VenueOfferTile } from 'features/venue/atoms/VenueOfferTile'
import { analytics } from 'libs/analytics'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, getDisplayPrice } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { useCategoryIdMapping, useCategoryHomeLabelMapping } from 'libs/subcategories'
import { ButtonWithLinearGradient } from 'ui/components/buttons/ButtonWithLinearGradient'
import { MARGIN_DP, Spacer, Typo } from 'ui/theme'

interface Props {
  venueId: number
  layout?: Layout
}

const keyExtractor = (item: SearchHit) => item.objectID

const VENUE_OFFERS_CTA_WORDING = t`Voir toutes les offres`

export const VenueOffers: React.FC<Props> = ({ venueId, layout = 'one-item-medium' }) => {
  const { data: venue } = useVenue(venueId)
  const { data: venueOffers } = useVenueOffers(venueId)
  const { position } = useGeolocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const params = useVenueSearchParameters(venueId)
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
    [position]
  )

  const seeAllOffers = useCallback(() => {
    analytics.logVenueSeeAllOffersClicked(venueId)
    navigate(...getTabNavConfig('Search', params))
  }, [params])

  const showSeeMore = nbHits > hits.length
  const onPressSeeMore = showSeeMore
    ? () => {
        analytics.logVenueSeeMoreClicked(venueId)
        navigate(...getTabNavConfig('Search', params))
      }
    : undefined

  const { itemWidth, itemHeight } = getPlaylistItemDimensionsFromLayout(layout)

  if (!venue || !venueOffers || venueOffers.hits.length === 0) {
    return <React.Fragment></React.Fragment>
  }
  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <MarginContainer>
        <Typo.Title4>{t`Offres`}</Typo.Title4>
      </MarginContainer>
      <Spacer.Column numberOfSpaces={6} />
      <Playlist
        testID="offersModuleList"
        data={hits}
        itemHeight={itemHeight}
        itemWidth={itemWidth}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onPressSeeMore={onPressSeeMore}
      />
      <Spacer.Column numberOfSpaces={6} />
      <MarginContainer>
        <ButtonWithLinearGradient
          wording={VENUE_OFFERS_CTA_WORDING}
          onPress={seeAllOffers}
          isDisabled={false}
        />
      </MarginContainer>
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const MarginContainer = styled.View({
  marginHorizontal: PixelRatio.roundToNearestPixel(MARGIN_DP),
})
