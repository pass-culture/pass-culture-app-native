import { CategoryIdEnum, OfferResponse } from 'api/gen'

export function getOfferArtists(categoryId: CategoryIdEnum, offer: OfferResponse) {
  const { extraData } = offer

  switch (categoryId) {
    case CategoryIdEnum.LIVRE:
      return extraData?.author
    case CategoryIdEnum.MUSIQUE_ENREGISTREE:
    case CategoryIdEnum.MUSIQUE_LIVE:
      return extraData?.performer
    case CategoryIdEnum.SPECTACLE:
    case CategoryIdEnum.CINEMA:
      return extraData?.stageDirector
    default:
      return undefined
  }
}
