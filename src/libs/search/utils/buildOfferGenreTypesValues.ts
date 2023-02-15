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
  let mappedGenreTypesList: OfferGenreType[] = []

  if (bookTypes) {
    const mappedBookTypes = buildOfferGenreTypes(GenreType.BOOK, bookTypes, genreTypeMapping)
    mappedGenreTypesList = mappedGenreTypesList?.concat(mappedBookTypes ?? [])
  }
  if (movieGenres) {
    const mappedMovieGenres = buildOfferGenreTypes(GenreType.MOVIE, movieGenres, genreTypeMapping)
    mappedGenreTypesList = mappedGenreTypesList?.concat(mappedMovieGenres ?? [])
  }
  if (musicTypes) {
    const mappedMusicTypes = buildOfferGenreTypes(GenreType.MUSIC, musicTypes, genreTypeMapping)
    mappedGenreTypesList = mappedGenreTypesList?.concat(mappedMusicTypes ?? [])
  }
  if (showTypes) {
    const mappedShowTypes = buildOfferGenreTypes(GenreType.SHOW, showTypes, genreTypeMapping)
    mappedGenreTypesList = mappedGenreTypesList?.concat(mappedShowTypes ?? [])
  }

  return mappedGenreTypesList
}
