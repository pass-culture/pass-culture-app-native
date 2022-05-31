export const isBeforeToday = (year: number, month: number, day: number) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDate = now.getDate()

  let invalid = false
  if (year < currentYear) {
    invalid = true
  } else if (month < currentMonth && currentYear === year) {
    invalid = true
  } else if (day < currentDate && currentMonth === month && currentYear === year) {
    invalid = true
  }
  return invalid
}
