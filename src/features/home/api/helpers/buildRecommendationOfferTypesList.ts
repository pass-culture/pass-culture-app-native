import { RecommendedOffersParameters } from 'features/home/types'
import { RecommendedIdsRequest } from 'libs/recommendation/types'

export const buildRecommendationOfferTypesList = ({
  bookTypes,
}: {
  bookTypes: RecommendedOffersParameters['bookTypes']
}): RecommendedIdsRequest['offerTypeList'] => {
  let offerTypesList: RecommendedIdsRequest['offerTypeList'] = []
  const formattedBookTypes: RecommendedIdsRequest['offerTypeList'] = bookTypes?.map((bookType) => ({
    key: 'BOOK',
    value: bookType,
  }))

  offerTypesList = offerTypesList?.concat(formattedBookTypes ?? [])

  return offerTypesList
}
