import { t } from '@lingui/macro'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers } from 'features/venue/api/useVenueOffers'
import { TitleVenueOfferTile } from 'features/venue/atoms/TitleVenueOfferTile'
import { VenueOfferTile } from 'features/venue/atoms/VenueOfferTile'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, getDisplayPrice, parseCategory } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { Spacer } from 'ui/theme'

interface Props {
  venueId: number
}

const keyExtractor = (item: SearchHit) => item.objectID

export const VenueOffers: React.FC<Props> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const { position } = useGeolocation()

  const renderItem: ListRenderItem<SearchHit> = useCallback(
    ({ item }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      // TODO(antoinewg) Create a specific component with appropriate design
      return (
        <VenueOfferTile
          category={parseCategory(item.offer.category)}
          categoryName={item.offer.category}
          offerId={+item.objectID}
          description={item.offer.description || ''}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          moduleName="moduleName"
        />
      )
    },
    [position]
  )

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <TitleVenueOfferTile title={t`Offres`} />
      <Spacer.Column numberOfSpaces={4} />
      <Spacer.Row numberOfSpaces={6} />
      <FlatList
        testID="offersModuleList"
        ListHeaderComponent={HorizontalMargin}
        ListFooterComponent={HorizontalMargin}
        data={offers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Spacer.Row numberOfSpaces={6} />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const ItemSeparatorComponent = () => <Spacer.Row numberOfSpaces={4} />
const HorizontalMargin = () => <Spacer.Row numberOfSpaces={6} />
