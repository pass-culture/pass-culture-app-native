import { useCallback, useMemo, useState } from 'react'

import { OfferStockResponse, SubscriptionStatus, UserProfileResponse } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { useOngoingOrEndedBooking } from 'features/bookings/api'
import { formatHour } from 'features/bookOffer/helpers/utils'
import { EventCardSubtitleEnum } from 'features/offer/components/MovieScreeningCalendar/enums'
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
  const userHasNotCompletedSubscriptionYet =
    user?.status.subscriptionStatus === SubscriptionStatus.has_to_complete_subscription ||
    user?.status.subscriptionStatus === SubscriptionStatus.has_subscription_pending ||
    user?.status.subscriptionStatus === SubscriptionStatus.has_subscription_issues

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
          case !hasEnoughCredit && !userHasNotCompletedSubscriptionYet:
            subtitleLeft = EventCardSubtitleEnum.NOT_ENOUGH_CREDIT
            isDisabled = true
            break
          case (isUserCreditExpired || (isSameVenue && hasBookedOffer)) &&
            !userHasNotCompletedSubscriptionYet:
            subtitleLeft = screening.features.join(', ')
            isDisabled = true
            break
          default:
            subtitleLeft = screening.features.join(', ')
            isDisabled = false
        }

        const shouldNotHaveSubtitleRight =
          subtitleLeft === EventCardSubtitleEnum.NOT_ENOUGH_CREDIT ||
          subtitleLeft === EventCardSubtitleEnum.ALREADY_BOOKED ||
          subtitleLeft === EventCardSubtitleEnum.FULLY_BOOKED
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
          hasBookedScreening,
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
      userHasNotCompletedSubscriptionYet,
    ]
  )

  const convertToMinutes = (time: string): number => {
    const [hours, minutes] = time.split('h').map(Number)
    if (hours === undefined || minutes === undefined) return 0
    return hours * 60 + minutes
  }

  const selectedDateScreenings = useMemo(
    () => (offerVenueId: number, onPressOfferCTA?: () => void) => {
      if (!selectedScreeningStock) {
        return []
      }

      return selectedScreeningStock
        .map((screening) => mapScreeningsToEventCardProps(screening, offerVenueId, onPressOfferCTA))
        .filter(Boolean)
        .sort(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- filter(Boolean) removes undefined
          (a, b) => convertToMinutes(a!.title) - convertToMinutes(b!.title)
        ) as EventCardProps[]
    },
    [selectedScreeningStock, mapScreeningsToEventCardProps]
  )

  return {
    selectedDateScreenings,
    bookingData,
  }
}
