import React, { FunctionComponent, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'

import { OfferResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { MovieCalendar } from 'features/offer/components/MovieCalendar/MovieCalendar'
import { useMovieScreeningCalendar } from 'features/offer/components/MovieScreeningCalendar/useMovieScreeningCalendar'
import { useOfferCTAButton } from 'features/offer/components/OfferCTAButton/useOfferCTAButton'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsBookedOffer } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
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

  const {
    movieScreeningDates,
    selectedDate,
    setSelectedDate,
    getSelectedDateScreenings,
    bookingData,
  } = useMovieScreeningCalendar(stocks)

  const { onPress: onPressOfferCTA, CTAOfferModal } = useOfferCTAButton(
    offer,
    subcategory,
    bookingData
  )

  const scrollViewRef = useRef<ScrollView | null>(null)

  const { user, isLoggedIn } = useAuthContext()
  const userCredit = useCreditForOffer(offerId)
  const hasBookedOffer = offerId && user ? getIsBookedOffer(offerId, user.bookedOffers) : false
  const { data: userBooking } = useOngoingOrEndedBooking(
    getBookingOfferId(offerId, user?.bookedOffers) ?? 0
  )

  const eventCardData = getSelectedDateScreenings(
    offerVenueId,
    hasBookedOffer,
    userCredit,
    isLoggedIn,
    onPressOfferCTA,
    userBooking
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
