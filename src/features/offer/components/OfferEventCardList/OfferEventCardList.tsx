import React, { FC } from 'react'
import { View } from 'react-native'

import { OfferResponseV2 } from 'api/gen'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

type Props = {
  offer: OfferResponseV2
  selectedDate?: Date
}

export const OfferEventCardList: FC<Props> = ({ offer, selectedDate }) => {
  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[offer.subcategoryId]

  const { selectedScreeningStock } = useMovieScreeningCalendar(
    offer.stocks,
    selectedDate ?? new Date()
  )

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    offer.isExternalBookingsDisabled
  )

  const {
    onPress: onPressOffer,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const eventCardData = selectedDateScreenings(offer.venue.id, onPressOffer, movieScreeningUserData)

  return (
    <View testID="offer-event-card-list">
      {eventCardData ? <EventCardList data={eventCardData} /> : null}
      {CTAOfferModal}
    </View>
  )
}
