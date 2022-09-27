export function formatSecondsToString(delay: number) {
  if (delay <= 60 * 30) {
    const delayInMinutes = delay / 60
    return `${delayInMinutes} minutes`
  }

  const delayInHour = delay / 60 / 60
  if (delay === 60 * 60) {
    return `${delayInHour} heure`
  }

  if (delay <= 60 * 60 * 24 * 2) {
    return `${delayInHour} heures`
  }

  const delayInDay = delay / 60 / 60 / 24
  if (delay <= 60 * 60 * 24 * 6) {
    return `${delayInDay} jours`
  }

  const delayInWeek = delay / 60 / 60 / 24 / 7
  return `${delayInWeek} semaine`
}
