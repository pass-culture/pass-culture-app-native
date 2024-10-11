import React, { FC, useMemo } from 'react'

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
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const eventCardData = useMemo(
    () => selectedDateScreenings(venue.id, onPressOfferCTA, movieScreeningUserData),
    [venue.id, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )

  return (
    <React.Fragment>
      {eventCardData ? <EventCardList data={eventCardData} /> : null}
      {CTAOfferModal}
    </React.Fragment>
  )
}
