import React, { FunctionComponent, useEffect, useMemo, useRef } from 'react'
import { ScrollView } from 'react-native'

import { OfferResponse } from 'api/gen'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useSelectedDateScreening } from 'features/offer/components/MovieScreeningCalendar/useSelectedDateScreenings'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { Subcategory } from 'libs/subcategories/types'
import { EventCardList } from 'ui/components/eventCard/EventCardList'
import { Spacer } from 'ui/theme'

type Props = {
  offer: OfferResponse
  subcategory: Subcategory
}
export const MovieScreeningCalendar: FunctionComponent<Props> = ({ offer, subcategory }) => {
  const { stocks, id: offerId } = offer
  const offerVenueId = offer.venue.id

  const { movieScreeningDates, selectedDate, setSelectedDate, selectedScreeningStock } =
    useMovieScreeningCalendar(stocks)

  const { bookingData, selectedDateScreenings } = useSelectedDateScreening(
    selectedScreeningStock,
    offerId
  )

  const { onPress: onPressOfferCTA, CTAOfferModal } = useOfferCTAButton(
    offer,
    subcategory,
    bookingData
  )

  const scrollViewRef = useRef<ScrollView | null>(null)

  const eventCardData = useMemo(
    () => selectedDateScreenings(offerVenueId, onPressOfferCTA),
    [offerVenueId, onPressOfferCTA, selectedDateScreenings]
  )

  useEffect(() => {
    if (scrollViewRef?.current) {
      scrollViewRef.current.scrollTo({ x: 0 })
    }
  }, [scrollViewRef, offerId])

  return (
    <React.Fragment>
      <MovieCalendar
        dates={movieScreeningDates}
        selectedDate={selectedDate}
        onTabChange={setSelectedDate}
        scrollViewRef={scrollViewRef}
      />
      <Spacer.Column numberOfSpaces={6} />
      {eventCardData != undefined && <EventCardList data={eventCardData} />}
      <Spacer.Column numberOfSpaces={6} />
      {CTAOfferModal}
    </React.Fragment>
  )
}
