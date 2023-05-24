import { monthNames } from 'features/bookOffer/components/Calendar/Calendar.utils'

/**
 *Compare timestamps using this margin expressed in seconds for a better UX experience.
 *
 *Example : we do not want to tell a user a token is valid, for it to expire in the next 10 seconds.
 *So we do the follwoing comparison : now + TIMESTAMPS_COMPARE_MARGIN > token_validity
 */
const TIMESTAMPS_COMPARE_MARGIN = 300 // seconds

/**
 *@returns current timestamp expressed in seconds.
 */
export function currentTimestamp() {
  return Math.round(new Date().valueOf() / 1000)
}

/**
 *@param timestamp to check for expiration.
 *@param margin in seconds to add to current time for comparaison. Default value: 500.
 *@returns true if current time + margin is superior or equal to timestamp.
 */
export function isTimestampExpired(
  timestamp: number,
  margin: number = TIMESTAMPS_COMPARE_MARGIN
): boolean {
  return currentTimestamp() + margin >= timestamp
}

/**
 *@param oldDate earliest date.
 *@param newDate latest date.
 *@returns the number of full years between oldDate and newDate.
 */
export function dateDiffInFullYears(oldDate: Date, newDate: Date) {
  const yearNew = newDate.getFullYear()
  const monthNew = newDate.getMonth()
  const dayNew = newDate.getDate()
  const yearOld = oldDate.getFullYear()
  const monthOld = oldDate.getMonth()
  const dayOld = oldDate.getDate()

  let diffInYears = yearNew - yearOld
  if (monthOld > monthNew || (monthOld == monthNew && dayOld > dayNew)) {
    diffInYears--
  }

  return diffInYears
}

/**
 * Formats an iso date to a slashed french date.
 * @param ISODate a string date in the ISO 8601 format %Y-%m-%dT%H:%M:%S
 */
export const formatToSlashedFrenchDate = (ISODate: Date | string) => {
  const date = new Date(ISODate)
  const day = ('0' + date.getDate()).slice(-2)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const setDateOneDayEarlier = (ISODate: Date | string) => {
  const date = new Date(ISODate)
  date.setDate(date.getDate() - 1)
  return date
}

export const formatToReadableFrenchDate = (date: Date | string) => {
  const formattedDate = new Date(date)
  // @ts-ignore isNan works with empty dates
  if (isNaN(formattedDate)) return ''
  const monthOrder = formattedDate.getMonth()
  const day = ('0' + formattedDate.getDate()).slice(-2)
  const month = monthNames[monthOrder].toLowerCase()
  return `${day} ${month}`
}

export const timeDiffInHours = (date: Date | string) => {
  const formattedDate = new Date(date)
  const currentDate = new Date()
  const diff = (formattedDate.getTime() - currentDate.getTime()) / 3600000
  return Math.ceil(diff)
}
