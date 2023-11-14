import { OfferExtraData } from 'api/gen'

function filterByString(value: string | null | undefined): value is string {
  return Boolean(value)
}

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraData) {
  return [
    subcategoryLabel,
    extraData?.musicType,
    extraData?.musicSubType,
    extraData?.showType,
    extraData?.showSubType,
  ].filter(filterByString)
}
