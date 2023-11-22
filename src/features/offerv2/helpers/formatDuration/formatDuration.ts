export function formatDuration(duration: number) {
  if (duration === 0) return undefined

  const hours = Math.floor(duration / 60)
  const minutes = duration % 60

  if (minutes === 0) {
    return `${hours}h`
  } else if (hours === 0) {
    return `${minutes} minutes`
  } else {
    return `${hours}h${minutes}`
  }
}
