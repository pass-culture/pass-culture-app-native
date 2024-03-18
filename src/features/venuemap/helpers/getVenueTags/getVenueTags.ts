import { isString } from 'shared/string/isString'

export function getVenueTags({
  distance,
  venue_type,
}: {
  distance: string | undefined
  venue_type: string | undefined
}) {
  return [distance, venue_type].filter(isString)
}
