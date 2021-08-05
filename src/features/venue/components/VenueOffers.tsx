import { t } from '@lingui/macro'
import { useNavigation } from '@react-navigation/native'
import React, { useCallback } from 'react'
import { FlatList, ListRenderItem } from 'react-native'

import { OfferTile } from 'features/home/atoms'
import { UseNavigationType } from 'features/navigation/RootNavigator'
import { useVenue } from 'features/venue/api/useVenue'
import { useVenueOffers, useVenueSearchParameters } from 'features/venue/api/useVenueOffers'
import { useGeolocation } from 'libs/geolocation'
import { formatDates, formatDistance, getDisplayPrice, parseCategory } from 'libs/parsers'
import { SearchHit } from 'libs/search'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { Spacer, Typo } from 'ui/theme'

interface Props {
  venueId: number
}

const keyExtractor = (item: SearchHit) => item.objectID

export const VenueOffers: React.FC<Props> = ({ venueId }) => {
  const { data: venue } = useVenue(venueId)
  const { data: offers } = useVenueOffers(venueId)
  const { position } = useGeolocation()
  const { navigate } = useNavigation<UseNavigationType>()
  const params = useVenueSearchParameters(venueId)

  const renderItem: ListRenderItem<SearchHit> = useCallback(
    ({ item }) => {
      const timestampsInMillis = item.offer.dates?.map((timestampInSec) => timestampInSec * 1000)
      // TODO(antoinewg) Create a specific component with appropriate design
      return (
        <OfferTile
          category={parseCategory(item.offer.category)}
          categoryName={item.offer.category}
          offerId={+item.objectID}
          description={item.offer.description || ''}
          distance={formatDistance(item._geoloc, position)}
          name={item.offer.name}
          date={formatDates(timestampsInMillis)}
          isDuo={item.offer.isDuo}
          thumbUrl={item.offer.thumbUrl}
          price={getDisplayPrice(item.offer.prices)}
          layout="one-item-medium"
          moduleName="moduleName"
        />
      )
    },
    [position]
  )

  const seeAllOffers = useCallback(() => {
    navigate('Search', { parameters: params })
  }, [params])

  if (!venue) return <React.Fragment></React.Fragment>

  return (
    <React.Fragment>
      <Spacer.Column numberOfSpaces={6} />
      <Typo.Title4>{t`Offres`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        data={offers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
      <Spacer.Column numberOfSpaces={6} />
      <ButtonPrimary title={t`Voir toutes les offres`} onPress={seeAllOffers} />
      <Spacer.Column numberOfSpaces={6} />
    </React.Fragment>
  )
}

const ItemSeparatorComponent = () => <Spacer.Row numberOfSpaces={4} />
