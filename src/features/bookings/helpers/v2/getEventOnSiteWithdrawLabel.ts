import { addDays } from 'date-fns'

import { BookingStockResponseV2 } from 'api/gen'
import {
  getWithoutWithdrawaDelayLabel,
  getWithLessOneDayWithdrawaDelayLabel,
  getWithOneDayWithdrawaDelayLabel,
  getWithTwoDaysWithdrawaDelayLabel,
} from 'features/bookings/helpers/getEventOnSiteWithdrawLabel'

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
  stock: BookingStockResponseV2,
  withdrawalDelay: number | null | undefined
): string => {
  if (!stock.beginningDatetime) return ''

  const properties = initGetEventOnSiteWithdrawLabelProperties(
    stock.beginningDatetime,
    withdrawalDelay
  )
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
