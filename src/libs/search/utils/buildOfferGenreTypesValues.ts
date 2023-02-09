import { OfferGenreType } from 'features/search/types'

export const buildOfferGenreTypesValues = ({
  movieGenres,
  musicTypes,
  showTypes,
}: {
  movieGenres: OfferGenreType[] | undefined
  musicTypes: OfferGenreType[] | undefined
  showTypes: OfferGenreType[] | undefined
}): OfferGenreType[] => {
  let finalOfferGenreType: OfferGenreType[] = []

  finalOfferGenreType = finalOfferGenreType?.concat(movieGenres ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(musicTypes ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(showTypes ?? [])

  return finalOfferGenreType
}
