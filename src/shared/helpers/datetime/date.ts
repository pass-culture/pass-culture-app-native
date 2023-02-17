import { Range } from '../../../libs/typesUtils/typeHelpers'

export const DAYS_IN_A_WEEK = 7
export const SATURDAY_INDEX_IN_A_WEEK = 6
export const SUNDAY_INDEX_IN_A_WEEK = 0
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000

const getDatesFromTimeRangeAndDate = (date: Date, timeRange: Range<number>): Range<Date> => {
  const beginningDatetime = getDateAtGivenTime(date, timeRange[0])
  const endingDatetime = getDateAtGivenTime(date, timeRange[1])
  return [beginningDatetime, endingDatetime]
}

const getDateAtGivenTime = (date: Date, hours: number): Date => {
  const dateWithTime = new Date(date.getTime())
  dateWithTime.setHours(hours)
  dateWithTime.setMinutes(0)
  dateWithTime.setSeconds(0)
  dateWithTime.setMilliseconds(0)
  return dateWithTime
}

const getWeekDatesFromDate = (date: Date): Date[] => {
  const dayOfTheWeek = date.getDay()
  if (dayOfTheWeek === SUNDAY_INDEX_IN_A_WEEK) return [date]
  let daysUntilSunday = DAYS_IN_A_WEEK - dayOfTheWeek
  const timestampsOfTheWeek = []
  while (daysUntilSunday >= 0) {
    timestampsOfTheWeek.push(date.getTime() + MILLISECONDS_IN_A_DAY * daysUntilSunday)
    daysUntilSunday--
  }
  return [...timestampsOfTheWeek]
    .sort((a, b) => a - b)
    .map((timestampOfTheWeek) => new Date(timestampOfTheWeek))
}

const getWeekEndDatesFromDate = (date: Date): Date[] => {
  const dayOfTheWeek = date.getDay()
  if (dayOfTheWeek === SUNDAY_INDEX_IN_A_WEEK) {
    return [date]
  }
  const daysUntilSaturday = SATURDAY_INDEX_IN_A_WEEK - dayOfTheWeek
  const timestampOfNextSaturday = date.getTime() + MILLISECONDS_IN_A_DAY * daysUntilSaturday
  const dateOfNextSaturday = new Date(timestampOfNextSaturday)

  const daysUntilSunday = DAYS_IN_A_WEEK - dayOfTheWeek
  const timestampOfNextSunday = date.getTime() + MILLISECONDS_IN_A_DAY * daysUntilSunday
  const dateOfNextSunday = new Date(timestampOfNextSunday)

  return [dateOfNextSaturday, dateOfNextSunday]
}

export const DATE = {
  getAllFromTimeRangeAndDate: getDatesFromTimeRangeAndDate,
  WEEK: {
    getAllFromDate: getWeekDatesFromDate,
  },
  WEEK_END: {
    getAllFromDate: getWeekEndDatesFromDate,
  },
}
