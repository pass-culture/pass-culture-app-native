import { FlashListRef } from '@shopify/flash-list'
import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import { OfferResponseV2 } from 'api/gen'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { Subcategory } from 'libs/subcategories/types'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { getSpacing } from 'ui/theme'

type Props = {
  offer: OfferResponseV2
  subcategory: Subcategory
}
export const MovieScreeningCalendar: FunctionComponent<Props> = ({ offer, subcategory }) => {
  const { stocks, id: offerId, isExternalBookingsDisabled } = offer
  const offerVenueId = offer.venue.id

  const { movieScreeningDates, selectedDate, setSelectedDate, selectedScreeningStock } =
    useMovieScreeningCalendar(stocks)

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    isExternalBookingsDisabled
  )

  const {
    onPress: onPressOfferCTA,
    CTAOfferModal,
    movieScreeningUserData,
  } = useOfferCTAButton(offer, subcategory, bookingData)

  const flatListRef = useRef<FlashListRef<Date> | null>(null)

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
    <MovieCalendarContainer gap={4}>
      <MovieCalendar
        dates={movieScreeningDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        listRef={flatListRef}
      />
      {eventCardData ? (
        <EventCardListContainer>
          <EventCardList data={eventCardData} />
        </EventCardListContainer>
      ) : null}
      {CTAOfferModal}
    </MovieCalendarContainer>
  )
}

const MovieCalendarContainer = styled(ViewGap)(({ theme }) => ({
  marginRight: theme.isDesktopViewport ? -getSpacing(16) : 0, // cancels padding of the parent container
}))

const EventCardListContainer = styled(View)(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))
