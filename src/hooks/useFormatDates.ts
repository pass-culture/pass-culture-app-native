import { useCallback } from 'react'

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
  const date = new Date(timestamp * 1000)
  const day = date.toLocaleString('fr-FR', { day: 'numeric' })
  const month = SHORT_MONTHS[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

export const getDisplayDates = (dates?: number[]): string | undefined => {
  if (!dates || dates.length === 0) return

  const uniqueDates = Array.from(new Set(dates.filter((p) => p > 0)))
  if (uniqueDates.length === 1) return formatToFrenchDate(uniqueDates[0])
  return `Dès le ${formatToFrenchDate(uniqueDates.sort()[0])}`
}

export const useFormatDates = (): ((dates: number[] | undefined) => string | undefined) => {
  // Using a hook callback because it may depend on locale / TZ
  return useCallback(getDisplayDates, [])
}
