import React, { FC, useMemo } from 'react'
import styled from 'styled-components/native'

import type { OfferPreviewResponse } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { MovieOffer } from 'features/offer/components/MoviesScreeningCalendar/getNextMoviesByDate'
import { NextScreeningButton } from 'features/offer/components/MoviesScreeningCalendar/NextScreeningButton'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing, Spacer } from 'ui/theme'

type MovieOfferTileProps = {
  movieOffer: MovieOffer
  venueOffers: VenueOffers
  date: Date
  isLast: boolean
  nextScreeningDate?: Date
  setSelectedDate: (date: Date) => void
}

export const MovieOfferTile: FC<MovieOfferTileProps> = ({
  venueOffers,
  date,
  movieOffer: { offer },
  isLast,
  nextScreeningDate,
  setSelectedDate,
}) => {
  const movieScreenings = getMovieScreenings(offer.stocks)

  const selectedScreeningStock = useMemo(
    () => movieScreenings[getDateString(`${date}`)],
    [movieScreenings, date]
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
      <ContainerWithMargin>
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
      </ContainerWithMargin>
      <Spacer.Column numberOfSpaces={4} />
      {nextScreeningDate ? (
        <ContainerWithMargin>
          <NextScreeningButton
            date={nextScreeningDate}
            onPress={() => {
              setSelectedDate(nextScreeningDate)
            }}
          />
        </ContainerWithMargin>
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

const ContainerWithMargin = styled.View({
  marginHorizontal: getSpacing(6),
})
