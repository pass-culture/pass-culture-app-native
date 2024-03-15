function filterByString(value: string | null | undefined): value is string {
  return Boolean(value)
}

export function getVenueTags({
  distance,
  venue_type,
}: {
  distance: string | undefined
  venue_type: string | undefined
}) {
  return [distance, venue_type].filter(filterByString)
}
