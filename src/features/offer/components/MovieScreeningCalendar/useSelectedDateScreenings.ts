import { useCallback, useMemo, useState } from 'react'

import { OfferStockResponse, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enum'
import { MovieScreeningBookingData } from 'features/offer/components/MovieScreeningCalendar/types'
import { getBookingOfferId } from 'features/offer/helpers/getBookingOfferId/getBookingOfferId'
import { getIsBookedOffer } from 'features/offer/helpers/useCtaWordingAndAction/useCtaWordingAndAction'
import { formatToFrenchDecimal } from 'libs/parsers/getDisplayPrice'
import { getAvailableCredit } from 'shared/user/useAvailableCredit'
import { EventCardProps } from 'ui/components/eventCard/EventCard'

export const useSelectedDateScreening = (
  selectedScreeningStock: OfferStockResponse[] | undefined,
  offerId: number
) => {
  const [bookingData, setBookingData] = useState<MovieScreeningBookingData>()
  const { user, isLoggedIn } = useAuthContext()

  const { amount: userCredit, isExpired: isUserCreditExpired } = useMemo(
    () =>
      isLoggedIn && user
        ? getAvailableCredit(user as UserProfileResponse)
        : { amount: 0, isExpired: false },
    [user, isLoggedIn]
  )

  const hasBookedOffer = useMemo(
    () => (offerId && user ? getIsBookedOffer(offerId, user.bookedOffers) : false),
    [offerId, user]
  )

  const { data: userBooking } = useOngoingOrEndedBooking(
    getBookingOfferId(offerId, user?.bookedOffers) ?? 0
  )

  const mapScreeningsToEventCardProps = useCallback(
    (screening: OfferStockResponse, offerVenueId: number, onPressOfferCTA?: () => void) => {
      const { beginningDatetime, isSoldOut } = screening
      if (beginningDatetime) {
        const hasEnoughCredit = isLoggedIn ? screening.price <= userCredit : true
        const price = formatToFrenchDecimal(screening.price).replace(' ', '')
        const hasBookedScreening = userBooking?.stock?.beginningDatetime === beginningDatetime
        const isSameVenue = offerVenueId === userBooking?.stock?.offer?.venue?.id

        let isDisabled: boolean
        let subtitleLeft: EventCardSubtitleEnum | string
        switch (true) {
          case hasBookedScreening:
            subtitleLeft = EventCardSubtitleEnum.ALREADY_BOOKED
            isDisabled = true
            break
          case isSoldOut:
            subtitleLeft = EventCardSubtitleEnum.FULLY_BOOKED
            isDisabled = true
            break
          case !hasEnoughCredit:
            subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
            isDisabled = true
            break
          case isUserCreditExpired || (isSameVenue && hasBookedOffer):
            subtitleLeft = screening.features.join(', ')
            isDisabled = true
            break
          default:
            subtitleLeft = screening.features.join(', ')
            isDisabled = false
        }

        const shouldNotHaveSubtitleRight =
          subtitleLeft === EventCardSubtitleEnum.NOT_ENOUGH_CREDIT ||
          subtitleLeft === EventCardSubtitleEnum.ALREADY_BOOKED
        const subtitleRight = shouldNotHaveSubtitleRight ? undefined : price

        const onPress = () => {
          if (hasBookedScreening || isDisabled) return

          setBookingData({
            date: new Date(beginningDatetime),
            hour: new Date(beginningDatetime).getHours(),
            stockId: screening.id,
          })

          onPressOfferCTA?.()
        }

        return {
          onPress,
          isDisabled,
          title: formatHour(beginningDatetime).replace(':', 'h'),
          subtitleLeft,
          subtitleRight,
        }
      }
      return undefined
    },
    [
      isLoggedIn,
      isUserCreditExpired,
      userCredit,
      userBooking?.stock?.beginningDatetime,
      userBooking?.stock?.offer?.venue?.id,
      hasBookedOffer,
    ]
  )

  const selectedDateScreenings = useMemo(
    () => (offerVenueId: number, onPressOfferCTA?: () => void) => {
      if (!selectedScreeningStock) {
        return []
      }

      return selectedScreeningStock
        .map((screening) => mapScreeningsToEventCardProps(screening, offerVenueId, onPressOfferCTA))
        .filter(Boolean) as EventCardProps[]
    },
    [selectedScreeningStock, mapScreeningsToEventCardProps]
  )

  return {
    selectedDateScreenings,
    bookingData,
  }
}
