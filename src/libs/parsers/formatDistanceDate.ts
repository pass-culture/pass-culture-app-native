export const formatDistanceDate = (distance?: string, date?: string) => {
  if (distance && date) return `à ${distance} • ${date}`
  if (distance) return `à ${distance}`
  return date
}
