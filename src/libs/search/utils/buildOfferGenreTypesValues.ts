import { OfferGenreType } from 'features/search/types'

export const buildOfferGenreTypesValues = ({
  bookTypes,
  movieGenres,
  musicTypes,
  showTypes,
}: {
  bookTypes: OfferGenreType[] | undefined
  movieGenres: OfferGenreType[] | undefined
  musicTypes: OfferGenreType[] | undefined
  showTypes: OfferGenreType[] | undefined
}): OfferGenreType[] => {
  let finalOfferGenreType: OfferGenreType[] = []

  finalOfferGenreType = finalOfferGenreType?.concat(bookTypes ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(movieGenres ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(musicTypes ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(showTypes ?? [])

  return finalOfferGenreType
}
