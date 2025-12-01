import React, { FC, useMemo } from 'react'
import { View } from 'react-native'

import { OfferResponseV2 } from 'api/gen'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { useABSegment } from 'shared/useABSegment/useABSegment'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

type Props = {
  offer: OfferResponseV2
  selectedDate?: Date
}

export const OfferEventCardList: FC<Props> = ({ offer, selectedDate = new Date() }) => {
  const { stocks, isExternalBookingsDisabled, venue } = offer

  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[offer.subcategoryId]

  const { selectedScreeningStock } = useMovieScreeningCalendar(stocks, selectedDate)
  const segment = useABSegment()

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    segment,
    isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const eventCardData = useMemo(
    () => selectedDateScreenings(venue.id, onPressOfferCTA, movieScreeningUserData),
    [venue.id, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )

  return (
    <View testID="offer-event-card-list">
      {eventCardData ? <EventCardList data={eventCardData} /> : null}
      {CTAOfferModal}
    </View>
  )
}
