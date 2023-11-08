import { OfferExtraData } from 'api/gen'

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraData) {
  return [
    subcategoryLabel,
    extraData?.musicType,
    extraData?.musicSubType,
    extraData?.showType,
    extraData?.showSubType,
  ].filter(Boolean) as string[]
}
