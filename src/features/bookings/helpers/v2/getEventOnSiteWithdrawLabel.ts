import { addDays, isSameDay, addHours, format } from 'date-fns'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const TWO_DAYS_IN_SECONDS = 60 * 60 * 48

type GetEventOnSiteWithdrawLabelProperties = {
  now: Date
  eventDate: Date
  withdrawalDelay: number
  eventDateMinus3Days: Date
  eventDateMinus2Days: Date
  eventDateMinus1Day: Date
}

export const getEventOnSiteWithdrawLabel = (
  beginningDatetime: string | null | undefined,
  withdrawalDelay: number | null | undefined
): string => {
  if (!beginningDatetime) return ''

  const properties = initGetEventOnSiteWithdrawLabelProperties(beginningDatetime, withdrawalDelay)
  if (!properties || properties.now > properties.eventDate) return ''

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
  withdrawalDelay: number | null | undefined
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
  }
}

export const getWithoutWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (
    isSameDay(properties.now, properties.eventDateMinus3Days) ||
    isSameDay(properties.now, properties.eventDateMinus2Days)
  ) {
    return 'Billet à retirer sur place'
  }

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return 'Billet à retirer sur place d’ici demain'

  if (isSameDay(properties.now, properties.eventDate))
    return 'Billet à retirer sur place aujourd’hui'

  return ''
}

export const getWithLessOneDayWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
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

export const getWithOneDayWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return 'Billet à retirer sur place dans 2 jours'

  if (isSameDay(properties.now, properties.eventDateMinus2Days))
    return 'Billet à retirer sur place dès demain'

  if (isSameDay(properties.now, properties.eventDateMinus1Day))
    return 'Billet à retirer sur place dès aujourd’hui'

  if (isSameDay(properties.now, properties.eventDate)) {
    return 'Billet à retirer sur place aujourd’hui'
  }

  return ''
}

export const getWithTwoDaysWithdrawaDelayLabel = (
  properties: GetEventOnSiteWithdrawLabelProperties
): string => {
  if (isSameDay(properties.now, properties.eventDateMinus3Days))
    return 'Billet à retirer sur place dès demain'

  if (
    isSameDay(properties.now, properties.eventDateMinus2Days) ||
    isSameDay(properties.now, properties.eventDateMinus1Day)
  )
    return 'Billet à retirer sur place dès aujourd’hui'

  if (isSameDay(properties.now, properties.eventDate)) {
    return 'Billet à retirer sur place aujourd’hui'
  }

  return ''
}
