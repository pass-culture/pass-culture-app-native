export const isBeforeToday = (year: number, month: number, day: number) => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()
  const currentDate = now.getDate()

  const isBeforeCurrentYear = year < currentYear
  const isBeforeCurrentMonth = month < currentMonth && currentYear === year
  const isBeforeCurrentDay = day < currentDate && currentMonth === month && currentYear === year

  return isBeforeCurrentYear || isBeforeCurrentMonth || isBeforeCurrentDay
}
