import React, { FC, useMemo } from 'react'
import styled from 'styled-components/native'

import type { OfferPreviewResponse, OfferResponseV2 } from 'api/gen'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing, Spacer } from 'ui/theme'

type MovieOfferTileProps = {
  offer: OfferResponseV2
  venueOffers: VenueOffers
  date: Date
  isLast: boolean
}

export const MovieOfferTile: FC<MovieOfferTileProps> = ({ venueOffers, date, offer, isLast }) => {
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
    [offer.venue.id, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )
  const offerScreeningOnSelectedDates = useMemo(
    () => venueOffers.hits.find((item) => Number(item.objectID) === offer.id),
    [offer.id, venueOffers.hits]
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
            subtitles={getSubtitles(offer)}
            withRightArrow
          />
        ) : null}
      </HorizontalOfferTileContainer>

      <Spacer.Column numberOfSpaces={4} />
      {eventCardData ? <EventCardList data={eventCardData} withMargin /> : null}
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
