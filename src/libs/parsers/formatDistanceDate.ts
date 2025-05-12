import { LENGTH_M, RATIO_HOME_IMAGE } from 'ui/theme'

export const MIN_WIDTH_DISTANCE_DISPLAYED = LENGTH_M * RATIO_HOME_IMAGE

export const formatDistanceDate = (width: number, distance?: string, date?: string) => {
  const showDistance = !!distance && width >= MIN_WIDTH_DISTANCE_DISPLAYED

  if (distance && date && showDistance) return `à ${distance} • ${date}`
  if (distance && showDistance) return `à ${distance}`
  return date
}
