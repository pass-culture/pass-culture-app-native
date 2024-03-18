import { OfferExtraData } from 'api/gen'
import { isString } from 'shared/string/isString'

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraData) {
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
