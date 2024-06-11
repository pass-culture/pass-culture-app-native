export const formatDuration = (duration: number | null | undefined): string => {
  if (!duration) return '-'

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (minutes === 0) {
    return `${hours}h`
  }
  if (hours === 0) {
    return `${minutes} minutes`
  }

  return `${hours}h${minutes}`
}
