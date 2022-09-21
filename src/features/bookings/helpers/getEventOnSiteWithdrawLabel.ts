import { isSameDay, addDays, addHours, format } from 'date-fns'

import { BookingStockResponse } from 'api/gen'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const TWO_DAYS_IN_SECONDS = 60 * 60 * 48

export type GetEventOnSiteWithdrawLabelProperties = {
  now: Date
  eventDate: Date
  withdrawalDelay: number
  eventDateMinus3Days: Date
  eventDateMinus2Days: Date
  eventDateMinus1Day: Date
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
