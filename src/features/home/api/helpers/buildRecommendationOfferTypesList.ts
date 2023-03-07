import { RecommendedOffersParameters } from 'features/home/types'
import { RecommendedIdsRequest } from 'libs/recommendation/types'

export const buildRecommendationOfferTypesList = ({
  bookTypes,
  movieGenres,
}: {
  bookTypes: RecommendedOffersParameters['bookTypes']
  movieGenres: RecommendedOffersParameters['movieGenres']
}): RecommendedIdsRequest['offerTypeList'] => {
  let offerTypesList: RecommendedIdsRequest['offerTypeList'] = []

  const formattedBookTypes: RecommendedIdsRequest['offerTypeList'] = bookTypes?.map((bookType) => ({
    key: 'BOOK',
    value: bookType,
  }))
  const formattedMovieGenres: RecommendedIdsRequest['offerTypeList'] = movieGenres?.map(
    (movieGenre) => ({
      key: 'MOVIE',
      value: movieGenre,
    })
  )

  offerTypesList = offerTypesList?.concat(formattedBookTypes ?? [])
  offerTypesList = offerTypesList?.concat(formattedMovieGenres ?? [])

  return offerTypesList
}
