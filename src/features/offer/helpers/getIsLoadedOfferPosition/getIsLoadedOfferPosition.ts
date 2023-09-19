import { Coordinates } from 'api/gen'

export function getIsLoadedOfferPosition(position?: Coordinates) {
  return Boolean(position?.latitude !== undefined && position?.longitude !== undefined)
}
