import { LocationCircleArea } from 'features/home/types'

export function buildLocalization(
  latitude?: number,
  longitude?: number,
  radius?: number
): LocationCircleArea | undefined {
  if (!!latitude && !!longitude && !!radius)
    return {
      latitude,
      longitude,
      radius,
    }
  return undefined
}
