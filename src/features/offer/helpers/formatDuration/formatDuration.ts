export const formatDuration = (duration: number | null | undefined): string => {
  if (!duration) return '-'

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (hours === 0) {
    return `${minutes} minutes`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes
  return `${hours}h${formattedMinutes}`
}
