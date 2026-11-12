import React, { FC, useMemo } from 'react'
import { View } from 'react-native'

import { OfferForStocksResponse } from 'api/gen'
import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import { useSelectedDateSpecialEventScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateSpecialEventScreenings'
import { useSpecialEventMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useSpecialEventMovieScreeningCalendar'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { getCinemaOfferForCTA } from 'features/offer/helpers/getCinemaOfferForCTA'
import { useSubcategoriesMapping } from 'libs/subcategories'

type Props = {
  offer: OfferForStocksResponse
  selectedDate?: Date
}

export const SpecialEventOfferEventCardList: FC<Props> = ({ offer, selectedDate = new Date() }) => {
  const { stocks, isExternalBookingsDisabled, venue } = offer

  const subcategoriesMapping = useSubcategoriesMapping()
  const subcategory = subcategoriesMapping[offer.subcategoryId]

  const { selectedScreeningStock } = useSpecialEventMovieScreeningCalendar(stocks, selectedDate)

  const { bookingData, selectedDateScreenings } = useSelectedDateSpecialEventScreening(
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
      <CinemaScreeningCardList screenings={eventCardData} />
      {CTAOfferModal}
    </View>
  )
}
