import { OfferExtraDataResponse } from 'api/gen'
import { isString } from 'shared/typeguards/isString'

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraDataResponse) {
  const cinemaGenres = extraData?.genres?.map((genre) => genre) ?? []

  return [
    subcategoryLabel,
    extraData?.musicType,
    extraData?.musicSubType,
    extraData?.showType,
    extraData?.showSubType,
  ]
    .filter(isString)
    .concat(cinemaGenres)
}
