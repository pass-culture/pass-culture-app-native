import { Range } from '../../../libs/typesUtils/typeHelpers'

import { DATE, DAYS_IN_A_WEEK, SATURDAY_INDEX_IN_A_WEEK, SUNDAY_INDEX_IN_A_WEEK } from './date'

const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000
const MILLISECONDS_IN_A_SECOND = 1000

const getTimestampFromDate = (date: Date): number => {
  const dateInTimestamp = date.getTime() / MILLISECONDS_IN_A_SECOND
  return Math.ceil(dateInTimestamp)
}

const getTimestampsFromTimeRangeAndDates = (dates: Date[], timeRange: Range<number>) => {
  return dates.map((date: Date) => getTimestampsFromTimeRangeAndDate(date, timeRange))
}

const getTimestampsFromTimeRangeAndDate = (date: Date, timeRange: Range<number>): Range<number> => {
  const dateRange = DATE.getAllFromTimeRangeAndDate(date, timeRange)
  return [getTimestampFromDate(dateRange[0]), getTimestampFromDate(dateRange[1])]
}

const getFirstTimestampOfDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  return getTimestampFromDate(new Date(year, month, day, 0, 0, 0, 0))
}

const getLastTimestampOfDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  return getTimestampFromDate(new Date(year, month, day, 23, 59, 59, 0))
}

const getLastWeekTimestampFromDate = (date: Date) => {
  const dayOfTheWeek = date.getDay()
  if (dayOfTheWeek === SUNDAY_INDEX_IN_A_WEEK) return TIMESTAMP.getLastOfDate(date)
  const daysUntilSunday = DAYS_IN_A_WEEK - dayOfTheWeek
  const dateOfNextSunday = date.getTime() + MILLISECONDS_IN_A_DAY * daysUntilSunday
  return TIMESTAMP.getLastOfDate(new Date(dateOfNextSunday))
}

const getWeekTimestampsFromTimeRangeAndDate = (date: Date, timeRange: Range<number>) => {
  const datesOfTheWeek = DATE.WEEK.getAllFromDate(date)
  return TIMESTAMP.getAllFromTimeRangeAndDates(datesOfTheWeek, timeRange)
}

const getFirstWeekEndTimestampFromDate = (date: Date) => {
  const dayOfTheWeek = date.getDay()
  if (dayOfTheWeek === SUNDAY_INDEX_IN_A_WEEK || dayOfTheWeek === SATURDAY_INDEX_IN_A_WEEK)
    return TIMESTAMP.getFromDate(date)
  const daysUntilSaturday = SATURDAY_INDEX_IN_A_WEEK - dayOfTheWeek
  const dateOfNextSaturday = date.getTime() + MILLISECONDS_IN_A_DAY * daysUntilSaturday
  return TIMESTAMP.getFirstOfDate(new Date(dateOfNextSaturday))
}

const getWeekEndTimestampsFromTimeRangeAndDate = (date: Date, timeRange: Range<number>) => {
  const datesOfTheWeekend = DATE.WEEK_END.getAllFromDate(date)
  return TIMESTAMP.getAllFromTimeRangeAndDates(datesOfTheWeekend, timeRange)
}

export const TIMESTAMP = {
  getFirstOfDate: getFirstTimestampOfDate,
  getLastOfDate: getLastTimestampOfDate,
  getFromDate: getTimestampFromDate,
  getAllFromTimeRangeAndDates: getTimestampsFromTimeRangeAndDates,
  getAllFromTimeRangeAndDate: getTimestampsFromTimeRangeAndDate,
  WEEK_END: {
    getFirstFromDate: getFirstWeekEndTimestampFromDate,
    getAllFromTimeRangeAndDate: getWeekEndTimestampsFromTimeRangeAndDate,
  },
  WEEK: {
    getLastFromDate: getLastWeekTimestampFromDate,
    getAllFromTimeRangeAndDate: getWeekTimestampsFromTimeRangeAndDate,
  },
}

export const computeTimeRangeFromHoursToSeconds = (timeRange: Range<number>) => {
  const now = new Date()
  const offsetInMinutes = now.getTimezoneOffset()
  return timeRange.map((timeInHour) => {
    const timeInSeconds = timeInHour * 60 * 60
    const offsetInSeconds = offsetInMinutes * 60

    return timeInSeconds + offsetInSeconds
  })
}
