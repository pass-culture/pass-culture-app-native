import { Duration } from 'features/offer/types'

const buildDuration = (label: string, accessibilityLabel: string): Duration => ({
  label,
  accessibilityLabel,
})

const formatValue = (value: number): string => (value < 10 ? `0${value}` : `${value}`)

const formatSecondsDuration = (hours: number, minutes: number, seconds: number): Duration => {
  const formattedSeconds = formatValue(seconds)
  const formattedMinutes = formatValue(minutes)

  if (hours === 0 && minutes === 0) {
    return buildDuration(`${seconds}s`, `${seconds} secondes`)
  }
  if (hours === 0) {
    return seconds === 0
      ? buildDuration(`${minutes}min`, `${minutes} minutes`)
      : buildDuration(`${minutes}min${formattedSeconds}`, `${minutes} minutes ${formattedSeconds}`)
  }

  if (minutes === 0 && seconds === 0) {
    return buildDuration(`${hours}h`, `${hours} heures`)
  }

  return buildDuration(`${hours}h${formattedMinutes}`, `${hours} heures ${formattedMinutes}`)
}

export const formatDuration = (
  duration: number | null | undefined,
  unit: 'min' | 'sec' = 'min'
): Duration => {
  if (!duration) return { label: '-', accessibilityLabel: 'Durée non définie' }

  const totalSeconds = unit === 'min' ? duration * 60 : duration

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const formattedMinutes = formatValue(minutes)

  if (unit === 'sec') {
    return formatSecondsDuration(hours, minutes, seconds)
  }

  if (hours === 0) {
    return buildDuration(`${minutes}min`, `${minutes} minutes`)
  }

  if (minutes === 0) {
    return buildDuration(`${hours}h`, `${hours} heures`)
  }

  return buildDuration(`${hours}h${formattedMinutes}`, `${hours} heures ${formattedMinutes}`)
}
