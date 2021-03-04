import { t } from '@lingui/macro'

import { _ } from '../i18n'

// javascript Date can't find them...
const MONTHS = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
]

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export const formatToCompleteFrenchDate = (date: Date) => {
  const weekDay = DAYS[date.getDay()]
  return `${weekDay} ${formatToFrenchDate(date)}`
}

export const decomposeDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return { day, month, year }
}

export const formatToFrenchDate = (
  date: Date | number | { day: number; month: string; year: number }
) => {
  const timestamp = date instanceof Date ? date.getTime() : date
  const { day, month, year } = typeof timestamp === 'number' ? decomposeDate(timestamp) : timestamp
  return `${day} ${month} ${year}`
}

/**
 * @param timestamps: Array of timestamps in millisecond
 */
export const getUniqueSortedTimestamps = (timestamps: number[] | undefined): number[] => {
  if (!timestamps || timestamps.length === 0) return []
  const uniqueTimestamps = Array.from(new Set(timestamps))
  const futureTimestamps = uniqueTimestamps.filter((timestamp) => timestamp >= new Date().valueOf())
  return futureTimestamps.sort()
}

/**
 * @param timestamps: Array of timestamps in millisecond
 */
export const formatDates = (timestamps?: number[]): string | undefined => {
  const uniques = getUniqueSortedTimestamps(timestamps)
  if (uniques.length === 0) return
  if (uniques.length === 1) return formatToFrenchDate(uniques[0])
  return _(t`Dès le ${formatToFrenchDate(uniques[0])}`)
}

export const formatDatePeriod = (dates: Date[] | undefined): string | undefined => {
  const timestamps = getUniqueSortedTimestamps(dates?.map((date) => new Date(date).getTime()))
  if (timestamps.length === 0) return
  if (timestamps.length === 1) return formatToFrenchDate(timestamps[0])

  const first = decomposeDate(timestamps[0])
  const last = decomposeDate(timestamps.slice(-1)[0])
  const formattedEndDate = formatToFrenchDate(last)

  if (first.year !== last.year) return _(t`Du ${formatToFrenchDate(first)} au ${formattedEndDate}`)
  if (first.month !== last.month) return _(t`Du ${first.day} ${first.month} au ${formattedEndDate}`)
  return _(t`Du ${first.day} au ${formattedEndDate}`)
}

export function formatDateToISOStringWithoutTime(date: Date): string {
  const ISOString = date.toISOString()
  return ISOString.substr(0, ISOString.indexOf('T'))
}
