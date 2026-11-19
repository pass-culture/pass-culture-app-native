import React, { FC } from 'react'

import { CinemaScreeningCardList } from 'features/offer/components/CinemaScreeningCard/CinemaScreeningCardList'
import { useSelectedDateSpecialEventScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateSpecialEventScreenings'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTileLayout } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTileLayout'
import { SpecialEventMovieOffer } from 'features/offer/components/MoviesScreeningCalendar/specialEventTypes'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { getCinemaOfferForCTA } from 'features/offer/helpers/getCinemaOfferForCTA'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/helpers/getMovieScreenings/getMovieScreenings'
import { VenueOffers } from 'features/venue/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useSubcategoriesMapping } from 'libs/subcategories'

type SpecialEventMovieOfferTileProps = {
  movieOffer: SpecialEventMovieOffer
  venueOffers: VenueOffers
  isLast: boolean
  nextScreeningDate?: Date
}

export const SpecialEventMovieOfferTile: FC<SpecialEventMovieOfferTileProps> = ({
  venueOffers,
  movieOffer: { offer },
  isLast,
  nextScreeningDate,
}) => {
  const movieScreenings = getMovieScreenings(offer.stocks)
  const { goToDate, selectedDate } = useMovieCalendar()

  const selectedScreeningStock = movieScreenings[getDateString(String(selectedDate))]

  const subcategoriesMapping = useSubcategoriesMapping()

  const { bookingData, selectedDateScreenings } = useSelectedDateSpecialEventScreening(
    selectedScreeningStock,
    offer.isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(
    getCinemaOfferForCTA(offer),
    subcategoriesMapping[offer.subcategoryId],
    bookingData
  )

  const eventCardData = selectedDateScreenings(
    offer.venue.id,
    () => {
      onPressOfferCTA()
      triggerConsultOfferLog({
        offerId: Number(offerScreeningOnSelectedDates?.objectID),
        from: 'venue',
        venueId: offer.venue.id,
      })
    },
    movieScreeningUserData
  )

  const offerScreeningOnSelectedDates = venueOffers.hits.find(
    (item) => Number(item.objectID) === offer.id
  )

  return (
    <MovieOfferTileLayout
      offerScreening={offerScreeningOnSelectedDates}
      subtitles={[]}
      nextScreeningDate={nextScreeningDate}
      onPressOfferCTA={onPressOfferCTA}
      goToDate={goToDate}
      screeningList={<CinemaScreeningCardList screenings={eventCardData} />}
      CTAOfferModal={CTAOfferModal}
      isLast={isLast}
    />
  )
}
