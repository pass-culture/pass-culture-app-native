import React, { FC, FunctionComponent, useMemo, useRef, useState } from 'react'
import { View, FlatList } from 'react-native'
import styled from 'styled-components/native'

import type { OfferPreviewResponse, OfferResponseV2 } from 'api/gen'
import { useOffersStocks } from 'features/offer/api/useOffersStocks'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import {
  getDateString,
  getMovieScreenings,
} from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { filterOffersStocksByDate } from 'features/offer/components/MoviesScreeningCalendar/filterOffersStocksByDate'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { formatDuration } from 'features/offer/helpers/formatDuration/formatDuration'
import { VenueOffers } from 'features/venue/api/useVenueOffers'
import { useSubcategoriesMapping } from 'libs/subcategories'
import { getDates } from 'shared/date/getDates'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { HorizontalOfferTile } from 'ui/components/tiles/HorizontalOfferTile'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  venueOffers: VenueOffers
}

const getSubtitles = (offer: OfferPreviewResponse): string[] => {
  const genre = offer.extraData?.genres?.length ? offer.extraData?.genres?.join(' / ') : ''

  const duration = offer.durationMinutes ? formatDuration(offer.durationMinutes) : '-'

  return [genre, duration ?? '-']
}

const useMoviesScreeningsList = (offerIds: number[]) => {
  const dates = getDates(new Date(), 15)
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0])
  const { data: offersWithStocks } = useOffersStocks({ offerIds })

  const filteredOffersWithStocks = useMemo(
    () => filterOffersStocksByDate(offersWithStocks, selectedDate),
    [offersWithStocks, selectedDate]
  )

  return { dates, selectedDate, setSelectedDate, offersWithStocks: filteredOffersWithStocks }
}

export const MoviesScreeningCalendar: FunctionComponent<Props> = ({ venueOffers }) => {
  const offerIds = venueOffers.hits.map((offer) => Number(offer.objectID))
  const flatListRef = useRef<FlatList | null>(null)
  const {
    dates: nextFifteenDates,
    selectedDate,
    setSelectedDate,
    offersWithStocks,
  } = useMoviesScreeningsList(offerIds)

  return (
    <React.Fragment>
      <MovieCalendar
        dates={nextFifteenDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        flatListRef={flatListRef}
      />
      <Spacer.Column numberOfSpaces={4} />
      <FlatList
        data={offersWithStocks?.offers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <MovieOfferTile
            offer={item}
            venueOffers={venueOffers}
            date={selectedDate}
            isLast={index === (offersWithStocks?.offers.length ?? 0) - 2}
          />
        )}
      />
    </React.Fragment>
  )
}

type MovieOfferTileProps = {
  offer: OfferResponseV2
  venueOffers: VenueOffers
  date: Date
  isLast: boolean
}

const MovieOfferTile: FC<MovieOfferTileProps> = ({ venueOffers, date, offer, isLast }) => {
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
    <MovieCalendarContainer>
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
      <Spacer.Column numberOfSpaces={4} />
      {eventCardData ? <EventCardList data={eventCardData} /> : null}
      <Spacer.Column numberOfSpaces={4} />
      {isLast ? null : <Divider />}
      <Spacer.Column numberOfSpaces={4} />
      {CTAOfferModal}
    </MovieCalendarContainer>
  )
}

const MovieCalendarContainer = styled(View)(() => ({
  marginLeft: getSpacing(6),
}))

const Divider = styled.View(({ theme }) => ({
  height: 1,
  backgroundColor: theme.colors.greyMedium,
  marginRight: getSpacing(6),
}))
