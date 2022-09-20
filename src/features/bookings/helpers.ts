import { isSameDay, addDays, addHours, format } from 'date-fns'

import { BookingStockResponse, SettingsResponse, WithdrawalTypeEnum } from 'api/gen'
import { getLocationLabel } from 'features/bookings/getLocationLabel'
import {
  formatToCompleteFrenchDate,
  formatToCompleteFrenchDateTime,
  isToday,
  isTomorrow,
} from 'libs/parsers'
import { plural } from 'libs/plural'

import { Booking } from './components/types'

export type BookingProperties = {
  isDuo?: boolean
  isEvent?: boolean
  isPhysical?: boolean
  isDigital?: boolean
  isPermanent?: boolean
  hasActivationCode?: boolean
}

export type GetEventOnSiteWithdrawLabelProperties = {
  now: Date
  eventDate: Date
  withdrawalDelay: number
  eventDateMinus3Days: Date
  eventDateMinus2Days: Date
  eventDateMinus1Day: Date
}

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const TWO_DAYS_IN_SECONDS = 60 * 60 * 48

export function getBookingProperties(booking: Booking, isEvent: boolean): BookingProperties {
  if (!booking) {
    return {}
  }

  const { stock } = booking
  const { offer } = stock

  return {
    isDuo: isDuoBooking(booking),
    isEvent,
    isPhysical: !isEvent,
    isDigital: offer.isDigital,
    isPermanent: offer.isPermanent,
    hasActivationCode: booking.activationCode != null,
  }
}

function isDuoBooking(booking: Booking) {
  return booking.quantity === 2
}

function getDateLabel(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
): string {
  if (properties.isPermanent) return 'Permanent'

  if (appSettings && appSettings.autoActivateDigitalBookings && properties.hasActivationCode) {
    return getBookingLabelForActivationCode(booking)
  }

  if (properties.isEvent) {
    if (!booking.stock.beginningDatetime) return ''
    const day = formatToCompleteFrenchDateTime(new Date(booking.stock.beginningDatetime), false)
    return `Le ${day}`
  }

  if (properties.isPhysical) {
    if (!booking.expirationDate) return ''
    const dateLimit = formatToCompleteFrenchDate(new Date(booking.expirationDate), false)
    return `À retirer avant le ${dateLimit}`
  }

  return ''
}

function getEventWithdrawLabel(stock: BookingStockResponse): string {
  if (!stock.beginningDatetime) return ''
  if (isToday(new Date(stock.beginningDatetime))) return "Aujourd'hui"
  if (isTomorrow(new Date(stock.beginningDatetime))) return 'Demain'
  return ''
}

export function getEventOnSiteWithdrawLabel(stock: BookingStockResponse): string {
  if (!stock.beginningDatetime) return ''

  const properties = initGetEventOnSiteWithdrawLabelProperties(stock)
  if (!properties) return ''

  if (properties.now > properties.eventDate) return ''

  if (properties.withdrawalDelay === 0) return getWithoutWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay < ONE_DAY_IN_SECONDS)
    return getWithLessOneDayWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay === ONE_DAY_IN_SECONDS)
    return getWithOneDayWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay === TWO_DAYS_IN_SECONDS)
    return getWithTwoDaysWithdrawaDelayLabel(properties)

  return ''
}

function initGetEventOnSiteWithdrawLabelProperties(
  stock: BookingStockResponse
): GetEventOnSiteWithdrawLabelProperties | undefined {
  if (!stock.beginningDatetime) return undefined

  const eventDate = new Date(stock.beginningDatetime)
  return {
    now: new Date(),
    eventDate,
    withdrawalDelay: stock.offer.withdrawalDelay || 0,
    eventDateMinus3Days: addDays(eventDate, -3),
    eventDateMinus2Days: addDays(eventDate, -2),
    eventDateMinus1Day: addDays(eventDate, -1),
  }
}

function getWithoutWithdrawaDelayLabel(properties: GetEventOnSiteWithdrawLabelProperties): string {
  if (
    isSameDay(properties.now, properties.eventDateMinus3Days) ||
    isSameDay(properties.now, properties.eventDateMinus2Days)
  ) {
    return 'Billet à retirer sur place'
  }

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return "Billet à retirer sur place d'ici demain"

  if (isSameDay(properties.now, properties.eventDate))
    return "Billet à retirer sur place aujourd'hui"

  return ''
}

function getWithLessOneDayWithdrawaDelayLabel(
  properties: GetEventOnSiteWithdrawLabelProperties
): string {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return 'Billet à retirer sur place dans 3 jours'

  if (isSameDay(properties.now, properties.eventDateMinus2Days))
    return 'Billet à retirer sur place dans 2 jours'

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return 'Billet à retirer sur place demain'

  if (isSameDay(properties.now, properties.eventDate)) {
    const withdrawalDelayInHours = properties.withdrawalDelay / 60 / 60
    const possibleWithdrawalDate = addHours(properties.eventDate, -withdrawalDelayInHours)
    const hours = format(possibleWithdrawalDate, 'HH')
    const minutes = format(possibleWithdrawalDate, 'mm')
    return `Billet à retirer sur place dès ${hours}h${minutes}`
  }

  return ''
}

function getWithOneDayWithdrawaDelayLabel(
  properties: GetEventOnSiteWithdrawLabelProperties
): string {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return 'Billet à retirer sur place dans 2 jours'

  if (isSameDay(properties.now, properties.eventDateMinus2Days))
    return 'Billet à retirer sur place dès demain'

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return "Billet à retirer sur place dès aujourd'hui"

  if (isSameDay(properties.now, properties.eventDate)) {
    return "Billet à retirer sur place aujourd'hui"
  }

  return ''
}

function getWithTwoDaysWithdrawaDelayLabel(
  properties: GetEventOnSiteWithdrawLabelProperties
): string {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return 'Billet à retirer sur place dès demain'

  if (
    isSameDay(properties.now, properties.eventDateMinus2Days) ||
    isSameDay(properties.now, properties.eventDateMinus1Day)
  )
    return "Billet à retirer sur place dès aujourd'hui"

  if (isSameDay(properties.now, properties.eventDate)) {
    return "Billet à retirer sur place aujourd'hui"
  }

  return ''
}

function getPhysicalWithdrawLabel(expiration: string | null | undefined): string {
  if (!expiration) return ''
  if (isToday(new Date(expiration))) return 'Dernier jour pour retirer'
  if (isTomorrow(new Date(expiration))) return 'Avant dernier jour pour retirer'
  return ''
}

function getWithdrawLabel(booking: Booking, properties: BookingProperties): string {
  if (properties.isEvent)
    return booking.stock.offer.withdrawalType === WithdrawalTypeEnum.on_site
      ? getEventOnSiteWithdrawLabel(booking.stock)
      : getEventWithdrawLabel(booking.stock)

  if (properties.isPhysical) return getPhysicalWithdrawLabel(booking.expirationDate)

  return ''
}

export function getBookingLabels(
  booking: Booking,
  properties: BookingProperties,
  appSettings: SettingsResponse | null
) {
  return {
    dateLabel: getDateLabel(booking, properties, appSettings),
    withdrawLabel: getWithdrawLabel(booking, properties),
    locationLabel: getLocationLabel(booking.stock, properties),
  }
}

/**
 * @warning Calling this function assumes appSettings.autoActivateDigitalBookings === true
 * @param booking
 * @param properties
 */
export function getBookingLabelForActivationCode(booking: Booking) {
  if (booking.activationCode?.expirationDate) {
    const dateLimit = formatToCompleteFrenchDate(
      new Date(booking.activationCode.expirationDate),
      false
    )
    return `À activer avant le ${dateLimit}`
  }

  return 'À activer'
}

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

export function formatSecondsToString(delay: number) {
  if (delay <= 60 * 30) {
    const delayInMinutes = delay / 60
    return `${delayInMinutes} minutes`
  }

  const delayInHour = delay / 60 / 60
  if (delay === 60 * 60) {
    return `${delayInHour} heure`
  }

  if (delay <= 60 * 60 * 24 * 2) {
    return `${delayInHour} heures`
  }

  const delayInDay = delay / 60 / 60 / 24
  if (delay <= 60 * 60 * 24 * 6) {
    return `${delayInDay} jours`
  }

  const delayInWeek = delay / 60 / 60 / 24 / 7
  return `${delayInWeek} semaine`
}
