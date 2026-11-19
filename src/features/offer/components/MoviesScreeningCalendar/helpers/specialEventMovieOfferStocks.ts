import { isAfter, isBefore, isSameDay } from 'date-fns'

import { StockResponse } from 'api/gen'
import { isDateNotWithinNextNbDays } from 'features/offer/helpers/isDateNotWithinNextNbDays'

type DatedStock = Pick<StockResponse, 'beginningDatetime'>

export const shouldKeepOfferWithoutScreeningsOnDay = (stocks: DatedStock[], selectedDate: Date) =>
  !stocks.some(({ beginningDatetime }) => {
    if (!beginningDatetime) return true

    const screeningDate = new Date(beginningDatetime)
    return isSameDay(screeningDate, selectedDate) && isAfter(screeningDate, selectedDate)
  })

export const getScreeningsOnDay = <Stock extends DatedStock>(
  stocks: Stock[],
  selectedDate: Date,
  referenceDate = new Date()
) =>
  stocks.filter(({ beginningDatetime }) => {
    if (!beginningDatetime) return false

    const screeningDate = new Date(beginningDatetime)
    const isScreeningOnSelectedDay = isSameDay(screeningDate, selectedDate)

    return isSameDay(referenceDate, selectedDate)
      ? isScreeningOnSelectedDay && isAfter(screeningDate, referenceDate)
      : isScreeningOnSelectedDay
  })

export const getScreeningsAfterNbDays = <Stock extends DatedStock>(
  stocks: Stock[],
  referenceDate: Date,
  nbDays: number
) =>
  stocks.filter(({ beginningDatetime }) =>
    beginningDatetime
      ? isDateNotWithinNextNbDays(referenceDate, new Date(beginningDatetime), nbDays)
      : false
  )

export const hasScreeningWithinNextNbDays = (
  stocks: DatedStock[],
  referenceDate: Date,
  nbDays: number
) =>
  stocks.some(({ beginningDatetime }) => {
    if (!beginningDatetime) return false

    const screeningDate = new Date(beginningDatetime)
    return (
      !isDateNotWithinNextNbDays(referenceDate, screeningDate, nbDays) &&
      !isBefore(screeningDate, referenceDate)
    )
  })
