import { OfferExtraData } from 'api/gen'

function filterByString(value: string | null | undefined): value is string {
  return Boolean(value)
}

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraData) {
  const cinemaGenres = extraData?.genres?.map((genre) => genre) ?? []

  return [
    subcategoryLabel,
    extraData?.musicType,
    extraData?.musicSubType,
    extraData?.showType,
    extraData?.showSubType,
  ]
    .filter(filterByString)
    .concat(cinemaGenres)
}
