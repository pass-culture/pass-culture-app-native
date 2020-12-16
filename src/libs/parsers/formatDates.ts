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

const formatToFrenchDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

/**
 * @param timestamps: Array of timestamps in millisecond
 * @param onlyFuture: if true, only future Dates will be preserved
 */
export const getUniqueSortedTimestamps = (
  timestamps: number[] | undefined,
  onlyFuture?: boolean
): number[] | undefined => {
  if (!timestamps || timestamps.length === 0) return
  const uniqueTimestamps = Array.from(
    new Set(
      timestamps
        .map((timestamp) => timestamp)
        .filter((timestamp) => !onlyFuture || timestamp >= new Date().valueOf())
    )
  )
  return uniqueTimestamps.sort()
}
/**
 * @param timestampsInMillis: array of timestamps
 */
export const formatDates = (timestampsInMillis?: number[]): string | undefined => {
  const uniqueSortedTimestamps = getUniqueSortedTimestamps(timestampsInMillis, true)
  if (!uniqueSortedTimestamps || uniqueSortedTimestamps.length === 0) return

  if (uniqueSortedTimestamps.length === 1) return formatToFrenchDate(uniqueSortedTimestamps[0])
  return `Dès le ${formatToFrenchDate(uniqueSortedTimestamps.sort()[0])}`
}

export const formatDatePeriod = (dates: Date[] | undefined): string | undefined => {
  const timestamps = dates?.map((date) => date.valueOf())
  const uniqueSortedTimestamps = getUniqueSortedTimestamps(timestamps, false)
  if (!uniqueSortedTimestamps || uniqueSortedTimestamps.length === 0) return

  if (uniqueSortedTimestamps.length === 1) return formatToFrenchDate(uniqueSortedTimestamps[0])
  const len = uniqueSortedTimestamps.length
  return _(
    /*i18n: Dates (dates will always be in french) */ t`Du ${formatToFrenchDate(
      uniqueSortedTimestamps[0]
    )} au ${formatToFrenchDate(uniqueSortedTimestamps[len - 1])}`
  )
}
