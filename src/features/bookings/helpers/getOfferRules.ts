import { WithdrawalTypeEnum } from 'api/gen'
import { Booking } from 'features/bookings/components/types'
import { BookingProperties } from 'features/bookings/helpers/getBookingProperties'
import { plural } from 'libs/plural'

export function getOfferRules(
  properties: BookingProperties,
  booking?: Booking,
  activationCodeFeatureEnabled?: boolean
): string {
  const { hasActivationCode, isDigital, isPhysical, isEvent } = properties
  const numberOfExternalBookings = booking?.externalBookings
    ? booking.externalBookings.length
    : undefined
  const withdrawalTypeDisplay =
    booking?.stock.offer.withdrawalType === WithdrawalTypeEnum.on_site ||
    !booking?.stock.offer.withdrawalType

  if (hasActivationCode && activationCodeFeatureEnabled)
    return 'Ce code est ta preuve d’achat, il te permet d’accéder à ton offre\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'

  if (isDigital)
    return 'Ce code à 6 caractères est ta preuve d’achat\u00a0! N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'

  if (numberOfExternalBookings) {
    return plural(numberOfExternalBookings, {
      one: 'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce QR code. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.',
      other:
        'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ces QR codes. N’oublie pas que tu n’as pas le droit de les revendre ou les céder.',
    })
  }

  if (isPhysical || (isEvent && withdrawalTypeDisplay))
    return 'Pour profiter de ta réservation, tu dois présenter ta carte d’identité et ce code à 6 caractères. N’oublie pas que tu n’as pas le droit de le revendre ou le céder.'

  return ''
}
