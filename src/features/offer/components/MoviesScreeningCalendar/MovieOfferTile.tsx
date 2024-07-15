import React, { FC, useMemo } from 'react'
import styled from 'styled-components/native'

import type { OfferPreviewResponse } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { MoviesOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing, Spacer } from 'ui/theme'

type MovieOfferTileProps = {
  moviesOffer: MoviesOffer
  venueOffers: VenueOffers
  date: Date
  isLast: boolean
  isUpcoming?: boolean
  nextScreeningDate?: Date
  setSelectedDate: (date: Date) => void
}

export const MovieOfferTile: FC<MovieOfferTileProps> = ({
  venueOffers,
  date,
  moviesOffer,
  isLast,
  isUpcoming,
  nextScreeningDate,
  setSelectedDate,
}) => {
  const movieScreenings = getMovieScreenings(moviesOffer.offer.stocks)

  const selectedScreeningStock = useMemo(
    () => movieScreenings[getDateString(`${date}`)],
    [movieScreenings, date]
  )

  const subcategoriesMapping = useSubcategoriesMapping()

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    moviesOffer.offer.isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(
    moviesOffer.offer,
    subcategoriesMapping[moviesOffer.offer.subcategoryId],
    bookingData
  )

  const eventCardData = useMemo(
    () =>
      selectedDateScreenings(moviesOffer.offer.venue.id, onPressOfferCTA, movieScreeningUserData),
    [movieScreeningUserData, moviesOffer.offer.venue.id, onPressOfferCTA, selectedDateScreenings]
  )
  const offerScreeningOnSelectedDates = useMemo(
    () => venueOffers.hits.find((item) => Number(item.objectID) === moviesOffer.offer.id),
    [moviesOffer.offer.id, venueOffers.hits]
  )
  return (
    <React.Fragment>
      <HorizontalOfferTileContainer>
        {offerScreeningOnSelectedDates ? (
          <HorizontalOfferTile
            offer={offerScreeningOnSelectedDates}
            analyticsParams={{
              from: 'venue',
            }}
            price={undefined}
            subtitles={getSubtitles(moviesOffer.offer)}
            withRightArrow
          />
        ) : null}
      </HorizontalOfferTileContainer>

      <Spacer.Column numberOfSpaces={4} />
      {nextScreeningDate ? (
        <NextScreeningButton
          date={nextScreeningDate}
          isUpcoming={isUpcoming}
          onPress={() => setSelectedDate(nextScreeningDate)}
        />
      ) : (
        <EventCardList data={eventCardData} />
      )}
      <Spacer.Column numberOfSpaces={4} />
      {isLast ? null : <Divider />}
      <Spacer.Column numberOfSpaces={4} />
      {CTAOfferModal}
    </React.Fragment>
  )
}

const getSubtitles = (offer: OfferPreviewResponse): string[] => {
  const genre = offer.extraData?.genres?.length ? offer.extraData?.genres?.join(' / ') : ''
  const duration = formatDuration(offer.durationMinutes)

  return [genre, duration]
}

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
  marginHorizontal: getSpacing(6),
}))

const HorizontalOfferTileContainer = styled.View({
  marginHorizontal: getSpacing(6),
})
