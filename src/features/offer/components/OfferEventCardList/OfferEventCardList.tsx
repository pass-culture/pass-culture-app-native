import React, { FC, useMemo } from 'react'
import { View } from 'react-native'

import { OfferForStocksResponse } from 'api/gen'
import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { getCinemaOfferForCTA } from 'features/offer/helpers/getCinemaOfferForCTA'
import { useSubcategoriesMapping } from 'libs/subcategories'

type Props = {
  offer: OfferForStocksResponse
  selectedDate?: Date
}

export const OfferEventCardList: FC<Props> = ({ offer, selectedDate = new Date() }) => {
  const { stocks, isExternalBookingsDisabled, venue } = offer

  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[offer.subcategoryId]

  const { selectedScreeningStock } = useMovieScreeningCalendar(stocks, selectedDate)

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(getCinemaOfferForCTA(offer), subcategory, bookingData)

  const eventCardData = useMemo(
    () => selectedDateScreenings(venue.id, onPressOfferCTA, movieScreeningUserData),
    [venue.id, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )

  return (
    <View testID="offer-event-card-list">
      {eventCardData ? <CinemaScreeningCardList screenings={eventCardData} /> : null}
      {CTAOfferModal}
    </View>
  )
}
