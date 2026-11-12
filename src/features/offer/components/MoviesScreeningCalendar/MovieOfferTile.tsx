import React, { FC } from 'react'

import type { OfferPreviewResponse } from 'api/gen'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { MovieOfferTileLayout } from 'features/offer/components/MoviesScreeningCalendar/MovieOfferTileLayout'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/types'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/helpers/getMovieScreenings/getMovieScreenings'
import { VenueOffers } from 'features/venue/types'
import { triggerConsultOfferLog } from 'libs/analytics/helpers/triggerLogConsultOffer/triggerConsultOfferLog'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

type MovieOfferTileProps = {
  movieOffer: MovieOffer
  venueOffers: VenueOffers
  isLast: boolean
  nextScreeningDate?: Date
}

export const MovieOfferTile: FC<MovieOfferTileProps> = ({
  venueOffers,
  movieOffer: { offer },
  isLast,
  nextScreeningDate,
}) => {
  const movieScreenings = getMovieScreenings(offer.stocks)
  const { goToDate, selectedDate } = useMovieCalendar()

  const selectedScreeningStock = movieScreenings[getDateString(String(selectedDate))]

  const subcategoriesMapping = useSubcategoriesMapping()

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    offer.isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategoriesMapping[offer.subcategoryId], bookingData)

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
      subtitles={getSubtitles(offer)}
      nextScreeningDate={nextScreeningDate}
      onPressOfferCTA={onPressOfferCTA}
      goToDate={goToDate}
      screeningList={<EventCardList data={eventCardData} />}
      CTAOfferModal={CTAOfferModal}
      isLast={isLast}
    />
  )
}

const getSubtitles = (offer: OfferPreviewResponse): string[] => {
  const genre = offer.extraData?.genres?.length ? offer.extraData?.genres?.join(' / ') : ''
  const duration = formatDuration(offer.extraData?.durationMinutes).label
  return [genre, duration]
}
