import { GenreType } from 'api/gen'
import { buildOfferGenreTypes } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/buildOfferGenreTypes'
import { useGenreTypeMapping } from 'libs/subcategories/mappings'
import { placeholderData } from 'libs/subcategories/placeholderData'
import { renderHook } from 'tests/utils'

const mockGenreTypes = placeholderData.genreTypes
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: { genreTypes: mockGenreTypes },
  }),
}))

describe('buildOfferGenreTypes', () => {
  const {
    result: { current: genreTypeMapping },
  } = renderHook(useGenreTypeMapping)

  it('should return correct offerGenreType list with known subtypes', () => {
    const offerGenreTypes = buildOfferGenreTypes(
      GenreType.MOVIE,
      ['BOLLYWOOD', 'ACTION', 'KOREAN_DRAMA'],
      genreTypeMapping
    )

    const expectedResult = [
      { key: GenreType.MOVIE, name: 'BOLLYWOOD', value: 'Bollywood' },
      { key: GenreType.MOVIE, name: 'ACTION', value: 'Action' },
      { key: GenreType.MOVIE, name: 'KOREAN_DRAMA', value: 'Drame coréen' },
    ]

    expect(offerGenreTypes).toEqual(expectedResult)
  })

  it('should return only known offerGenreTypes items', () => {
    const offerGenreTypes = buildOfferGenreTypes(
      GenreType.MOVIE,
      ['GROS_NAVET', 'ACTION'],
      genreTypeMapping
    )

    const expectedResult = [{ key: GenreType.MOVIE, name: 'ACTION', value: 'Action' }]

    expect(offerGenreTypes).toEqual(expectedResult)
  })

  it('should return undefined offerGenreType list when no subtypes are provided', () => {
    const offerGenreTypes = buildOfferGenreTypes(GenreType.MOVIE, [], genreTypeMapping)

    expect(offerGenreTypes).toEqual(undefined)
  })

  it('should return undefined offerGenreType list when subtype list is not recognized', () => {
    const offerGenreTypes = buildOfferGenreTypes(GenreType.MOVIE, ['GROS_NAVET'], genreTypeMapping)

    expect(offerGenreTypes).toEqual(undefined)
  })
})
