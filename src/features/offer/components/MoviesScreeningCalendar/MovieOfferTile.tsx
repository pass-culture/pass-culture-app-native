import React, { FC, useMemo } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import type { OfferPreviewResponse } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useMovieCalendar } from 'features/offer/components/MoviesScreeningCalendar/MovieCalendarContext'
import { isDateNotWithinNextNbDays } from 'features/offer/components/MoviesScreeningCalendar/moviesOffer.builder'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/types'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { VenueOffers } from 'features/venue/types'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { Spacer } from 'ui/theme'

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

  const selectedScreeningStock = useMemo(
    () => movieScreenings[getDateString(String(selectedDate))],
    [movieScreenings, selectedDate]
  )

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

  const eventCardData = useMemo(
    () => selectedDateScreenings(offer.venue.id, onPressOfferCTA, movieScreeningUserData),
    [movieScreeningUserData, offer.venue.id, onPressOfferCTA, selectedDateScreenings]
  )

  const offerScreeningOnSelectedDates = useMemo(
    () => venueOffers.hits.find((item) => Number(item.objectID) === offer.id),
    [offer.id, venueOffers.hits]
  )

  return (
    <React.Fragment>
      <View>
        {offerScreeningOnSelectedDates ? (
          <HorizontalOfferTile
            offer={offerScreeningOnSelectedDates}
            analyticsParams={{
              from: 'venue',
            }}
            price={undefined}
            subtitles={getSubtitles(offer)}
            withRightArrow
          />
        ) : null}
      </View>
      <Spacer.Column numberOfSpaces={4} />
      {nextScreeningDate ? (
        <View>
          <NextScreeningButton
            date={nextScreeningDate}
            onPress={
              isDateNotWithinNextNbDays(new Date(), nextScreeningDate, 15)
                ? () => onPressOfferCTA()
                : () => goToDate(nextScreeningDate)
            }
          />
        </View>
      ) : (
        <EventCardList
          data={eventCardData}
          analyticsFrom="venue"
          offerId={Number(offerScreeningOnSelectedDates?.objectID)}
        />
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
  const duration = formatDuration(offer.extraData?.durationMinutes).label

  return [genre, duration]
}

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.designSystem.color.background.subtle,
}))
