import { isAfter, isFirstDayOfMonth } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'

import { DAYS } from 'shared/date/days'
import { CAPITALIZED_SHORT_MONTHS, FullMonth, MONTHS, SHORT_MONTHS } from 'shared/date/months'

export const pad = (num: number): string => {
  const res = num.toString()
  return res.length === 1 ? '0' + res : res
}

export const getTimeStampInMillis = (dates: number[]) => {
  return dates?.map((timestampInSec) => timestampInSec * 1000)
}

export function formatToHour(date: Date) {
  return `${pad(date.getHours())}h${pad(date.getMinutes())}`
}

export const formatToCompleteFrenchDateTime = (date: Date, shouldDisplayWeekDay = true) => {
  return `${formatToCompleteFrenchDate(date, shouldDisplayWeekDay)} à ${formatToHour(date)}`
}

export const formatToCompleteFrenchDate = (date: Date, shouldDisplayWeekDay = true) => {
  const weekDay = DAYS[date.getDay()]
  return shouldDisplayWeekDay ? `${weekDay} ${formatToFrenchDate(date)}` : formatToFrenchDate(date)
}

export const decomposeDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const shortMonth = SHORT_MONTHS[date.getMonth()]
  const capitalizedShortMonth = CAPITALIZED_SHORT_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return { day, month, shortMonth, capitalizedShortMonth, year }
}

export const formatToFrenchDate = (date: Date) => {
  const { year } = decomposeDate(date.getTime())
  return `${formatToFrenchDateWithoutYear(date)} ${year}`
}

const isCurrentYear = (dateYear: number) => {
  const today = new Date()
  return dateYear === today.getFullYear()
}

const formatToFrenchDateForPlaylist = (date: Date, nbDates: number) => {
  const { year, capitalizedShortMonth } = decomposeDate(date.getTime())
  const startLabel = nbDates === 1 ? '' : 'Dès le '
  return isCurrentYear(year)
    ? `${startLabel}${formatToFrenchDateWithoutYear(date, true)}`
    : `${capitalizedShortMonth} ${year}`
}

export const formatToFrenchDateWithoutYear = (date: Date, withShortMonth?: boolean) => {
  const { day, month, shortMonth } = decomposeDate(date.getTime())
  const suffix = isFirstDayOfMonth(date) ? 'er' : ''
  return `${day}${suffix} ${withShortMonth ? shortMonth : month}`
}

/**
 * @param timestamps: Array of timestamps in millisecond
 */
export const getUniqueSortedTimestamps = (timestamps: number[] | undefined): number[] => {
  if (!timestamps || timestamps.length === 0) return []
  const uniqueTimestamps = Array.from(new Set(timestamps))
  const futureTimestamps = uniqueTimestamps.filter((timestamp) => timestamp >= new Date().valueOf())
  return futureTimestamps.sort((a, b) => a - b)
}

/**
 * @param timestamps: Array of timestamps in millisecond
 */
export const formatDates = (timestamps?: number[]): string | undefined => {
  const uniques = getUniqueSortedTimestamps(timestamps)
  const firstUnique = uniques[0]
  if (firstUnique) {
    return `${uniques.length === 1 ? '' : 'Dès le '}${formatToFrenchDate(new Date(firstUnique))}`
  }
  return undefined
}

export const formatPlaylistDates = (timestamps?: number[]): string | undefined => {
  const uniques = getUniqueSortedTimestamps(timestamps)
  const firstUnique = uniques[0]
  if (firstUnique) {
    return `${formatToFrenchDateForPlaylist(new Date(firstUnique), uniques.length)}`
  }
  return undefined
}

/**
 * @param releaseDate: Date
 */
const formatPlaylistReleaseDate = (releaseDate: Date): string => {
  const formattedDate = formatToFrenchDateForPlaylist(releaseDate, 1)
  const { year, capitalizedShortMonth } = decomposeDate(releaseDate.getTime())
  const label = isCurrentYear(year) ? `Dès le ${formattedDate}` : `${capitalizedShortMonth} ${year}`

  return isAfter(releaseDate, new Date()) ? label : ''
}

/**
 * @param releaseDate: Date
 */
export const formatReleaseDate = (releaseDate: Date, isPlaylist?: boolean): string => {
  const formattedDate = formatToFrenchDate(releaseDate)

  if (isPlaylist) return formatPlaylistReleaseDate(releaseDate)

  return isAfter(releaseDate, new Date()) ? `Dès le ${formattedDate}` : ''
}

/**
 * @param publicationDate: Date
 */
export const formatPublicationDate = (
  publicationDate: Date,
  shouldDisplayPublicationDate?: boolean
): string | undefined => {
  if (isAfter(publicationDate, new Date())) {
    return shouldDisplayPublicationDate
      ? `Disponible le ${formatToFrenchDateWithoutYear(publicationDate)}`
      : 'Bientôt disponible'
  }

  return undefined
}

type MonthDays = number[]
type YearGroup = Partial<Record<FullMonth, MonthDays>>
export type GroupResult = Record<number, YearGroup>

/**
 * Group an array of dates by year and month
 * @param decomposedDates - An array of dates decomposed using the `decomposeDate` function
 * @returns An object where the keys are the years and the values are objects where the keys are the months and the values are arrays of days
 */
export function groupByYearAndMonth(decomposedDates: ReturnType<typeof decomposeDate>[]) {
  // Start by reducing the array of dates to an object
  const grouped = decomposedDates.reduce<GroupResult>((acc, date) => {
    // Extract the year, month, and day from the decomposed date
    const year = date.year
    const month = date.month
    const day = date.day

    // If this is the first date we've seen for this year, create an empty object for it
    if (!acc[year]) {
      acc[year] = {}
    }

    // If this is the first date we've seen for this month in this year, create an empty array for it
    const yearGroup = acc[year]
    if (yearGroup && !yearGroup[month]) {
      yearGroup[month] = []
    }

    // Add the day to the array for this month in this year
    const monthDays = yearGroup?.[month]
    if (monthDays) {
      monthDays.push(day)
    }

    // Return the updated accumulator object for the reduce function
    return acc
  }, {})

  // Return the final grouped object
  return grouped
}

export function joinArrayElement(array: (string | number)[]): string {
  if (!array.length) return ''
  if (array.length === 1) return String(array[0])
  if (array.length === 2) return array.map(String).join(' et ')
  const first = array.slice(0, -1).map(String).join(', ')
  const last = String(array.at(-1) ?? '')
  return `${first} et ${last}`
}

export function formatGroupedDates(grouped: GroupResult) {
  let arrayDays: MonthDays[] = []
  const formatDates = Object.entries(grouped)
    .map(([year, groupedMonths]) => {
      return Object.entries(groupedMonths).map(([month, days]) => {
        const prefix = days.length > 1 ? 'les' : 'le'
        arrayDays = [...arrayDays, days]
        const arrayElementJoined = joinArrayElement(days)
        return arrayElementJoined ? `${prefix} ${arrayElementJoined} ${month} ${year}` : ''
      })
    })
    .flat()
  return { formatDates, arrayDays }
}

export const getFormattedDates = (dates: string[] | undefined): string => {
  if (!dates || dates.length === 0) return ''

  const timestamps = getUniqueSortedTimestamps(dates?.map((date) => new Date(date).getTime()))
  if (timestamps.length === 0) return ''
  if (timestamps.length === 1 && timestamps[0]) {
    return formatToFrenchDate(new Date(timestamps[0]))
  }

  const decomposedDates = timestamps.map(decomposeDate)

  // To avoid duplicates dates
  const uniqueDecomposedDates = Array.from(
    new Set(decomposedDates.map((date) => JSON.stringify(date)))
  ).map((dateString) => JSON.parse(dateString))

  const grouped = groupByYearAndMonth(uniqueDecomposedDates)

  const { formatDates, arrayDays } = formatGroupedDates(grouped)

  const flatArrayDays = arrayDays.flat()
  if (flatArrayDays.length >= 5) {
    return String(formatDatePeriod(timestamps))
  }

  return joinArrayElement(formatDates)
}

export const formatDatePeriod = (timestamps: number[]): string => {
  const lastTimestamp = timestamps.at(-1)
  const firstTimestamp = timestamps[0]
  if (timestamps.length < 1 || !firstTimestamp || !lastTimestamp)
    throw new Error('timestamps is missing in formatDatePeriod argument')
  const first = decomposeDate(firstTimestamp)
  const last = decomposeDate(lastTimestamp)
  const formattedEndDate = formatToFrenchDate(new Date(lastTimestamp))

  if (first.year !== last.year)
    return `Du ${formatToFrenchDate(new Date(firstTimestamp))} au ${formattedEndDate}`
  if (first.month !== last.month) return `Du ${first.day} ${first.month} au ${formattedEndDate}`
  if (first.day !== last.day) return `Du ${first.day} au ${formattedEndDate}`
  return formattedEndDate
}

export function formatDateToISOStringWithoutTime(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${year}-${pad(month)}-${pad(day)}`
}

export const isToday = (someDate: Date) => {
  const today = new Date()
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  )
}

export const isTomorrow = (someDate: Date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return (
    someDate.getDate() == tomorrow.getDate() &&
    someDate.getMonth() == tomorrow.getMonth() &&
    someDate.getFullYear() == tomorrow.getFullYear()
  )
}

export const localizeUTCDate = (someDate: Date | string) => {
  const utcDate = new Date(someDate)
  const timeZoneOffest = new Date(someDate).getTimezoneOffset()
  return utcDate.setMinutes(utcDate.getMinutes() - timeZoneOffest)
}

export function getTimeZonedDate(date: Date | string, timezone: string) {
  const utcDate = new Date(date)
  return utcToZonedTime(utcDate, timezone)
}

export const formatDateTimezone = (
  limitDate: string,
  shouldDisplayWeekDay?: boolean,
  timezone?: string
): string => {
  const limit = timezone ? getTimeZonedDate(limitDate, timezone) : new Date(limitDate)
  return `${formatToCompleteFrenchDate(limit, shouldDisplayWeekDay)}, ${formatToHour(limit)}`
}
