// javascript Date can't find them...
const SHORT_MONTHS = [
  'janv',
  'févr',
  'mars',
  'avr',
  'mai',
  'juin',
  'juil',
  'août',
  'sept',
  'oct',
  'nov',
  'déc',
]

const formatToFrenchDate = (timestamp: number) => {
  const date = new Date(timestamp)
  const day = date.toLocaleString('fr-FR', { day: 'numeric' })
  const month = SHORT_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
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
