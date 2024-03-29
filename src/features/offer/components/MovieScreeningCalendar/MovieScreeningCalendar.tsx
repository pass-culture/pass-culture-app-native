import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react'
import { FlatList, View } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import { OfferResponse } from 'api/gen'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { Subcategory } from 'libs/subcategories/types'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { getSpacing, Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponse
  subcategory: Subcategory
}
export const MovieScreeningCalendar: FunctionComponent<Props> = ({ offer, subcategory }) => {
  const { stocks, id: offerId } = offer
  const offerVenueId = offer.venue.id

  const { movieScreeningDates, selectedDate, setSelectedDate, selectedScreeningStock } =
    useMovieScreeningCalendar(stocks)

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(selectedScreeningStock)

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const { isDesktopViewport } = useTheme()

  const flatListRef = useRef<FlatList | null>(null)

  const eventCardData = useMemo(
    () => selectedDateScreenings(offerVenueId, onPressOfferCTA, movieScreeningUserData),
    [offerVenueId, onPressOfferCTA, selectedDateScreenings, movieScreeningUserData]
  )

  // Reset scroll and first selected date when user selects a new offer venue
  useEffect(() => {
    if (flatListRef?.current) {
      setSelectedDate(movieScreeningDates[0])
      flatListRef.current?.scrollToOffset({ offset: 0 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flatListRef, offerId, setSelectedDate]) // should be triggered by offerIdChange and not by movieScreeningDates

  return (
    <React.Fragment>
      <MovieCalendarContainer isDesktopViewport={isDesktopViewport}>
        <MovieCalendar
          dates={movieScreeningDates}
          selectedDate={selectedDate}
          onTabChange={setSelectedDate}
          flatListRef={flatListRef}
        />
        <Spacer.Column numberOfSpaces={4} />
        {eventCardData !== undefined && <EventCardList data={eventCardData} />}
        <Spacer.Column numberOfSpaces={6} />
        {CTAOfferModal}
      </MovieCalendarContainer>
    </React.Fragment>
  )
}

const MovieCalendarContainer = styled(View)<{ isDesktopViewport?: boolean }>(
  ({ isDesktopViewport }) => ({
    marginRight: isDesktopViewport ? -getSpacing(16) : 0, // cancels padding of the parent container
  })
)
