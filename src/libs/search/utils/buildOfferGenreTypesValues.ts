import { OfferGenreType } from 'features/search/types'

export const buildOfferGenreTypesValues = ({
  movieGenres,
  musicTypes,
}: {
  movieGenres: OfferGenreType[] | undefined
  musicTypes: OfferGenreType[] | undefined
}): OfferGenreType[] => {
  let finalOfferGenreType: OfferGenreType[] = []

  finalOfferGenreType = finalOfferGenreType?.concat(movieGenres ?? [])
  finalOfferGenreType = finalOfferGenreType?.concat(musicTypes ?? [])

  return finalOfferGenreType
}
