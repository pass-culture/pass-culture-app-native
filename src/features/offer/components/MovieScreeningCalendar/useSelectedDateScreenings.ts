import { useState } from 'react'

import { OfferStockResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enum'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { sortScreeningDates } from 'features/offer/components/MovieScreeningCalendar/utils'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsBookedOffer } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { useCreditForOffer } from 'features/offer/helpers/useHasEnoughCredit/useHasEnoughCredit'
import { formatToFrenchDecimal } from 'libs/parsers'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

export const useSelectedDateScreening = (
  selectedScreeningStock: OfferStockResponse[] | undefined,
  offerId: number
) => {
  const [bookingData, setBookingData] = useState<MovieScreeningBookingData>()
  const { user, isLoggedIn } = useAuthContext()
  const userCredit = useCreditForOffer(offerId)
  const hasBookedOffer = offerId && user ? getIsBookedOffer(offerId, user.bookedOffers) : false
  const { data: userBooking } = useOngoingOrEndedBooking(
    getBookingOfferId(offerId, user?.bookedOffers) ?? 0
  )
  const selectedDateScreenings = (offerVenueId: number, onPressOfferCTA?: () => void) => {
    if (!selectedScreeningStock) {
      return
    }
    selectedScreeningStock = sortScreeningDates(selectedScreeningStock)
    let eventCardProps: EventCardProps
    return selectedScreeningStock?.map((screening) => {
      const { beginningDatetime, isSoldOut } = screening
      if (beginningDatetime != null) {
        const hasEnoughCredit = isLoggedIn ? screening.price <= userCredit : true
        const price = formatToFrenchDecimal(screening.price).replace(' ', '')
        const hasBookedScreening = userBooking?.stock?.beginningDatetime === beginningDatetime
        const isSameVenue = offerVenueId === userBooking?.stock?.offer?.venue?.id

        let isDisabled: boolean
        let subtitleLeft
        switch (true) {
          case hasBookedScreening:
            subtitleLeft = EventCardSubtitleEnum.ALREADY_BOOKED
            isDisabled = true
            break
          case isSoldOut:
            subtitleLeft = EventCardSubtitleEnum.FULLY_BOOKED
            isDisabled = true
            break
          case isSameVenue && hasBookedOffer:
            subtitleLeft = screening.features.join(', ')
            isDisabled = true
            break
          case !hasEnoughCredit:
            subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
            isDisabled = true
            break
          default:
            subtitleLeft = screening.features.join(', ')
            isDisabled = false
        }

        const shouldNotHaveSubtitleRight =
          subtitleLeft === EventCardSubtitleEnum.NOT_ENOUGH_CREDIT ||
          subtitleLeft === EventCardSubtitleEnum.ALREADY_BOOKED
        const subtitleRight = shouldNotHaveSubtitleRight ? '' : price

        const onPress = () => {
          if (hasBookedScreening || isDisabled) {
            return
          }
          setBookingData({
            date: new Date(beginningDatetime),
            hour: new Date(beginningDatetime).getHours(),
            stockId: screening.id,
          })
          onPressOfferCTA?.()
        }

        eventCardProps = {
          onPress,
          isDisabled,
          title: formatHour(beginningDatetime).replace(':', 'h'),
          subtitleLeft,
          subtitleRight,
        }
      }
      return eventCardProps
    })
  }

  return {
    selectedDateScreenings,
    bookingData,
  }
}
