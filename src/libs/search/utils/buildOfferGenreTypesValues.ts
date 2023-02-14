import { GenreType } from 'api/gen'
import { OfferGenreType } from 'features/search/types'
import { buildOfferGenreTypes } from 'libs/search/utils/buildOfferGenreTypes'
import { GenreTypeMapping } from 'libs/subcategories/types'

export const buildOfferGenreTypesValues = (
  {
    bookTypes,
    movieGenres,
    musicTypes,
    showTypes,
  }: {
    bookTypes: string[] | undefined
    movieGenres: string[] | undefined
    musicTypes: string[] | undefined
    showTypes: string[] | undefined
  },
  genreTypeMapping: GenreTypeMapping
): OfferGenreType[] => {
  let finalOfferGenreType: OfferGenreType[] = []

  if (bookTypes) {
    finalOfferGenreType = finalOfferGenreType?.concat(
      buildOfferGenreTypes(GenreType.BOOK, bookTypes, genreTypeMapping) ?? []
    )
  }
  if (movieGenres) {
    finalOfferGenreType = finalOfferGenreType?.concat(
      buildOfferGenreTypes(GenreType.MOVIE, movieGenres, genreTypeMapping) ?? []
    )
  }
  if (musicTypes) {
    finalOfferGenreType = finalOfferGenreType?.concat(
      buildOfferGenreTypes(GenreType.MUSIC, musicTypes, genreTypeMapping) ?? []
    )
  }
  if (showTypes) {
    finalOfferGenreType = finalOfferGenreType?.concat(
      buildOfferGenreTypes(GenreType.SHOW, showTypes, genreTypeMapping) ?? []
    )
  }

  return finalOfferGenreType
}
