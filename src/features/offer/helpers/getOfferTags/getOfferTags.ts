import { OfferExtraData } from 'api/gen'

export function getOfferTags(subcategoryLabel: string, extraData?: OfferExtraData) {
  const tags: string[] = [subcategoryLabel]

  const pushTag = (mainType: string, subType?: string | null) => {
    tags.push(mainType)
    if (subType) {
      tags.push(subType)
    }
  }

  if (extraData?.musicType) {
    pushTag(extraData.musicType, extraData?.musicSubType)
  }

  if (extraData?.showType) {
    pushTag(extraData.showType, extraData?.showSubType)
  }

  return tags
}
