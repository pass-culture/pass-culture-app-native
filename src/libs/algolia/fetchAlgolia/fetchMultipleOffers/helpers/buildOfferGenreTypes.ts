import { GenreType, GenreTypeContentModel } from 'api/gen'
import { OfferGenreType } from 'features/search/types'
import { GenreTypeMapping } from 'libs/subcategories/types'

export const buildOfferGenreTypes = (
  genreType: GenreType,
  genreSubtypeNames: string[],
  genreTypeMapping: GenreTypeMapping
): OfferGenreType[] | undefined => {
  if (!genreSubtypeNames.length) return
  const genreTypeValues = genreTypeMapping[genreType]

  const offerGenreTypes = genreSubtypeNames.map((genreSubtypeName: string) => {
    const genreSubtypeItem = genreTypeValues.find(
      (genreTypeValue: GenreTypeContentModel) => genreTypeValue.name === genreSubtypeName
    )
    if (!genreSubtypeItem) return
    return { key: genreType, ...genreSubtypeItem }
  })

  const filteredOfferGenreTypes = offerGenreTypes.filter(Boolean)

  if (!filteredOfferGenreTypes.length) return

  return filteredOfferGenreTypes as OfferGenreType[]
}
