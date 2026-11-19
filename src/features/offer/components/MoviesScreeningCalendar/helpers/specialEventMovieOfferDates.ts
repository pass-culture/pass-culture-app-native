import { differenceInMilliseconds, isAfter } from 'date-fns'

import { StockResponse } from 'api/gen'
import { isDateNotWithinNextNbDays } from 'features/offer/helpers/isDateNotWithinNextNbDays'

type DatedStock = Pick<StockResponse, 'beginningDatetime'>

export const getNextScreeningDate = (
  stocks: DatedStock[],
  selectedDate: Date,
  referenceDate = new Date()
) => {
  const screeningDates = stocks.flatMap(({ beginningDatetime }) =>
    beginningDatetime ? [new Date(beginningDatetime)] : []
  )
  const nextScreeningDate = findClosestFutureDate(screeningDates, selectedDate)

  if (nextScreeningDate && isDateNotWithinNextNbDays(referenceDate, nextScreeningDate, 15)) {
    return undefined
  }

  return nextScreeningDate
}

export const getUpcomingScreeningDate = (stocks: DatedStock[], referenceDate = new Date()) =>
  getNextScreeningDate(stocks, referenceDate, referenceDate)

export const getEarliestScreeningTimestamp = (stocks: DatedStock[]) =>
  stocks.reduce((earliestTimestamp, { beginningDatetime }) => {
    if (!beginningDatetime) return earliestTimestamp

    return Math.min(new Date(beginningDatetime).getTime(), earliestTimestamp)
  }, Infinity)

const findClosestFutureDate = (dates: Date[], referenceDate: Date) => {
  const futureDates = dates.filter((date) => isAfter(date, referenceDate))

  return futureDates.reduce<Date | undefined>((closestDate, currentDate) => {
    if (!closestDate) return currentDate

    const closestDifference = Math.abs(differenceInMilliseconds(referenceDate, closestDate))
    const currentDifference = Math.abs(differenceInMilliseconds(referenceDate, currentDate))

    return currentDifference < closestDifference ? currentDate : closestDate
  }, undefined)
}
