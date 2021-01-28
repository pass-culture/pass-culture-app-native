/**
 * Formats an iso date to a slashed french date.
 * @param ISOBirthday the birthday date into the ISO 8601 format %Y-%m-%dT%H:%M:%S
 */
export function computeEligibilityExpiracy(ISOBirthday: string) {
  const date = new Date(ISOBirthday)
  date.setFullYear(date.getFullYear() + 19)
  date.setDate(date.getDate() - 1)
  date.setHours(23)
  date.setMinutes(59)
  date.setSeconds(59)
  return date
}
