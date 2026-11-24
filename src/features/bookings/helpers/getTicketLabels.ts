import { BookingResponse, TicketResponse, WithdrawalTypeEnum } from 'api/gen'
import { formatEventDateLabel } from 'features/bookings/helpers/getBookingLabels'
import { getBookingLabels } from 'features/bookings/helpers/v2/getBookingLabels'
import { getEventOnSiteWithdrawLabel } from 'features/bookings/helpers/v2/getEventOnSiteWithdrawLabel'
import { BookingDetailsResponse } from 'features/bookings/queries/selectors/selectBookingDetails'
import { BookingProperties } from 'features/bookings/types'
import { formatFullAddress } from 'shared/address/addressFormatter'

export const getTicketLabels = (
  booking: BookingResponse | BookingDetailsResponse,
  properties: BookingProperties,
  ticket: TicketResponse
) => {
  const { offer, beginningDatetime } = booking.stock
  const { dayLabel, hourLabel } = getBookingLabels(booking, properties)

  const formatExpirationDate = (prefix: string) =>
    booking.expirationDate
      ? formatEventDateLabel({
          date: booking.expirationDate,
          timezone: offer.venue.timezone,
          shouldDisplayWeekDay: false,
          format: 'dateWithoutYear',
          prefix,
        })
      : undefined

  return {
    day: dayLabel || undefined,
    hour: hourLabel || undefined,
    ean: offer.extraData?.ean ?? undefined,
    topExpirationDate: formatExpirationDate('À récupérer avant le '),
    bottomExpirationDate: formatExpirationDate('avant le '),
    withdrawLabel:
      ticket.withdrawal.type === WithdrawalTypeEnum.on_site
        ? getEventOnSiteWithdrawLabel(beginningDatetime, ticket.withdrawal.delay, false)
        : undefined,
    offerFullAddress: offer.address
      ? formatFullAddress(offer.address.street, offer.address.postalCode, offer.address.city)
      : undefined,
  }
}
