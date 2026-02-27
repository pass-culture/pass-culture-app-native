import { addDays, isSameDay, addHours, format } from 'date-fns'

import { formatToCompleteFrenchDate } from 'libs/parsers/formatDates'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const TWO_DAYS_IN_SECONDS = 60 * 60 * 48

type GetEventOnSiteWithdrawLabelProperties = {
  now: Date
  eventDate: Date
  withdrawalDelay: number
  eventDateMinus3Days: Date
  eventDateMinus2Days: Date
  eventDateMinus1Day: Date
  prefix: string
}

export const getEventOnSiteWithdrawLabel = (
  beginningDatetime: string | null | undefined,
  withdrawalDelay: number | null | undefined,
  withTicketPrefix = true
): string => {
  if (!beginningDatetime) return ''

  const prefix = withTicketPrefix ? 'Billet à retirer' : 'À retirer'
  const properties = initGetEventOnSiteWithdrawLabelProperties(
    beginningDatetime,
    withdrawalDelay,
    prefix
  )
  if (!properties || properties.now > properties.eventDate) return ''

  const label = getContextualLabel(properties)
  if (label) return label

  if (!withTicketPrefix) {
    const formattedDate = formatToCompleteFrenchDate({
      date: properties.eventDate,
      shouldDisplayWeekDay: false,
    })
    return `${prefix} le ${formattedDate}`
  }

  return ''
}

const getContextualLabel = (properties: GetEventOnSiteWithdrawLabelProperties): string => {
  if (properties.withdrawalDelay === 0) return getWithoutWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay < ONE_DAY_IN_SECONDS)
    return getWithLessOneDayWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay === ONE_DAY_IN_SECONDS)
    return getWithOneDayWithdrawaDelayLabel(properties)

  if (properties.withdrawalDelay === TWO_DAYS_IN_SECONDS)
    return getWithTwoDaysWithdrawaDelayLabel(properties)

  return ''
}

const initGetEventOnSiteWithdrawLabelProperties = (
  beginningDatetime: string | null,
  withdrawalDelay: number | null | undefined,
  prefix: string
): GetEventOnSiteWithdrawLabelProperties | undefined => {
  if (!beginningDatetime) return undefined

  const eventDate = new Date(beginningDatetime)
  return {
    now: new Date(),
    eventDate,
    withdrawalDelay: withdrawalDelay ?? 0,
    eventDateMinus3Days: addDays(eventDate, -3),
    eventDateMinus2Days: addDays(eventDate, -2),
    eventDateMinus1Day: addDays(eventDate, -1),
    prefix,
  }
}

const getWithoutWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (
    isSameDay(properties.now, properties.eventDateMinus3Days) ||
    isSameDay(properties.now, properties.eventDateMinus2Days)
  ) {
    return `${properties.prefix} sur place`
  }

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return `${properties.prefix} sur place d’ici demain`

  if (isSameDay(properties.now, properties.eventDate))
    return `${properties.prefix} sur place aujourd’hui`

  return ''
}

const getWithLessOneDayWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return `${properties.prefix} sur place dans 3 jours`

  if (isSameDay(properties.now, properties.eventDateMinus2Days))
    return `${properties.prefix} sur place dans 2 jours`

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return `${properties.prefix} sur place demain`

  if (isSameDay(properties.now, properties.eventDate)) {
    const withdrawalDelayInHours = properties.withdrawalDelay / 60 / 60
    const possibleWithdrawalDate = addHours(properties.eventDate, -withdrawalDelayInHours)
    const hours = format(possibleWithdrawalDate, 'HH')
    const minutes = format(possibleWithdrawalDate, 'mm')
    return `${properties.prefix} sur place dès ${hours}h${minutes}`
  }

  return ''
}

const getWithOneDayWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return `${properties.prefix} sur place dans 2 jours`

  if (isSameDay(properties.now, properties.eventDateMinus2Days))
    return `${properties.prefix} sur place dès demain`

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return `${properties.prefix} sur place dès aujourd’hui`

  if (isSameDay(properties.now, properties.eventDate)) {
    return `${properties.prefix} sur place aujourd’hui`
  }

  return ''
}

const getWithTwoDaysWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return `${properties.prefix} sur place dès demain`

  if (
    isSameDay(properties.now, properties.eventDateMinus2Days) ||
    isSameDay(properties.now, properties.eventDateMinus1Day)
  )
    return `${properties.prefix} sur place dès aujourd’hui`

  if (isSameDay(properties.now, properties.eventDate)) {
    return `${properties.prefix} sur place aujourd’hui`
  }

  return ''
}
