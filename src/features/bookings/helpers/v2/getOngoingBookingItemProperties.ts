import { BookingListItemResponse } from 'api/gen'
import {
  daysCountdown,
  displayExpirationMessage,
  expirationDateUtilsV2,
  getBookingLabelsV2,
  getBookingListItemProperties,
} from 'features/bookings/helpers'
import { analytics } from 'libs/analytics/provider'
import { TileContentType, tileAccessibilityLabel } from 'libs/tileAccessibilityLabel'

type OngoingBookingItem = {
  booking: BookingListItemResponse
  isEvent: boolean
  eligibleBookingsForArchive: BookingListItemResponse[]
}
export const getOngoingBookingItemProperties = ({
  booking,
  isEvent,
  eligibleBookingsForArchive,
}: OngoingBookingItem) => {
  const bookingProperties = getBookingListItemProperties(booking, isEvent)
  const { dateLabel, withdrawLabel } = getBookingLabelsV2.getBookingLabels(
    booking,
    bookingProperties
  )
  const daysLeft = daysCountdown(booking.dateCreated)

  const isBookingValid = expirationDateUtilsV2.isBookingEligibleForArchive(
    booking,
    eligibleBookingsForArchive
  )

  const accessibilityLabel = tileAccessibilityLabel(TileContentType.BOOKING, {
    name: booking.stock.offer.name,
    properties: bookingProperties,
    date: dateLabel,
  })

  const onBeforeNavigate = async () => {
    await analytics.logViewedBookingPage({
      offerId: booking.stock.offer.id,
      from: 'bookings',
    })
  }
  const navigateTo = { screen: 'BookingDetails', params: { id: booking.id } } as const

  return {
    accessibilityLabel,
    canDisplayExpirationMessage: !!isBookingValid && daysLeft >= 0,
    correctExpirationMessages: displayExpirationMessage(daysLeft),
    daysLeft,
    dateLabel,
    isBookingValid,
    isDuo: bookingProperties.isDuo,
    onBeforeNavigate,
    navigateTo,
    withdrawLabel,
  }
}
