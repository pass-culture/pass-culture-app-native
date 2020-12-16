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

export const formatDates = (dates?: number[]): string | undefined => {
  if (!dates || dates.length === 0) return

  const uniqueDates = Array.from(
    new Set(dates.map((p) => 1000 * p).filter((p) => p > new Date().valueOf()))
  )
  if (uniqueDates.length === 0) return
  if (uniqueDates.length === 1) return formatToFrenchDate(uniqueDates[0])
  return `Dès le ${formatToFrenchDate(uniqueDates.sort()[0])}`
}
