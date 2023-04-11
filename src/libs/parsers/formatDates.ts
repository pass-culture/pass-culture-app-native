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
] as const
type Month = typeof MONTHS[number]

const DAYS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export const pad = (num: number): string => {
  const res = num.toString()
  return res.length === 1 ? '0' + res : res
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
  const year = date.getFullYear()
  return { day, month, year }
}

// a-t-on encore besoin du type Date ?
export const formatToFrenchDate = (
  date: Date | number | string | { day: number; month: string; year: number }
) => {
  const formatedDate = typeof date === 'string' ? new Date(date) : date
  const timestamp = formatedDate instanceof Date ? formatedDate.getTime() : formatedDate
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
  return futureTimestamps.sort((a, b) => a - b)
}

/**
 * @param timestamps: Array of timestamps in millisecond
 */
export const formatDates = (timestamps?: number[]): string | undefined => {
  const uniques = getUniqueSortedTimestamps(timestamps)
  if (uniques.length === 0) return
  if (uniques.length === 1) return formatToFrenchDate(uniques[0])
  return `Dès le ${formatToFrenchDate(uniques[0])}`
}

type MonthDays = number[]
type YearGroup = Partial<Record<Month, MonthDays>>
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
    if (!acc[year][month]) {
      acc[year][month] = []
    }

    // Add the day to the array for this month in this year
    acc[year][month]?.push(day)

    // Return the updated accumulator object for the reduce function
    return acc
  }, {})

  // Return the final grouped object
  return grouped
}

export function joinArrayElement(array: (string | number)[] | MonthDays) {
  if (!array.length) {
    return
  }
  if (array.length === 1) {
    return array[0]
  } else if (array.length === 2) {
    return array.join(' et ')
  } else {
    const first = array.slice(0, -1).join(', ')
    const last = array.slice(-1)
    return `${first} et ${last}`
  }
}

export function formatGroupedDates(grouped: GroupResult) {
  let arrayDays: MonthDays[] = []
  const formatDates = Object.entries(grouped)
    .map(([year, groupedMonths]) => {
      return Object.entries(groupedMonths).map(([month, days]) => {
        const prefix = days.length > 1 ? 'les' : 'le'
        arrayDays = [...arrayDays, days]
        return `${prefix} ${joinArrayElement(days)} ${month} ${year}`
      })
    })
    .flat()
  return { formatDates, arrayDays }
}

export const getFormattedDates = (dates: string[] | undefined) => {
  if (!dates || dates.length === 0) return

  const timestamps = getUniqueSortedTimestamps(dates?.map((date) => new Date(date).getTime()))
  if (timestamps.length === 0) return
  if (timestamps.length === 1) return formatToFrenchDate(timestamps[0])

  const decomposedDates = timestamps.map(decomposeDate)
  const grouped = groupByYearAndMonth(decomposedDates)

  const { formatDates, arrayDays } = formatGroupedDates(grouped)

  const flatArrayDays = arrayDays.flat()
  if (flatArrayDays.length >= 5) {
    return formatDatePeriod(timestamps)
  }

  return joinArrayElement(formatDates)
}

export const formatDatePeriod = (timestamps: number[]) => {
  const first = decomposeDate(timestamps[0])
  const last = decomposeDate(timestamps.slice(-1)[0])
  const formattedEndDate = formatToFrenchDate(last)

  if (first.year !== last.year) return `Du ${formatToFrenchDate(first)} au ${formattedEndDate}`
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
