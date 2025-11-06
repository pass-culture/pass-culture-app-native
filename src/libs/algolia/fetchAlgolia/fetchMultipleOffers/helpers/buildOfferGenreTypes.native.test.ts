import { GenreType } from 'api/gen'
import { buildOfferGenreTypes } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOfferGenreTypes'
import { useGenreTypeMapping } from 'libs/subcategories/mappings'
import { renderHook } from 'tests/utils'

jest.mock('queries/subcategories/useSubcategoriesQuery')

describe('buildOfferGenreTypes', () => {
  const {
    result: { current: genreTypeMapping },
  } = renderHook(useGenreTypeMapping)

  it('should return correct offerGenreType list with known subtypes', () => {
    const offerGenreTypes = buildOfferGenreTypes(
      GenreType.MOVIE,
      ['Bollywood', 'Action', 'Drame coréen'],
      genreTypeMapping
    )

    const expectedResult = [
      { key: GenreType.MOVIE, name: 'BOLLYWOOD', value: 'Bollywood' },
      { key: GenreType.MOVIE, name: 'ACTION', value: 'Action' },
      { key: GenreType.MOVIE, name: 'KOREAN_DRAMA', value: 'Drame coréen' },
    ]

    expect(offerGenreTypes).toEqual(expectedResult)
  })

  it('should return correct offerGenreType list with known music subtypes', () => {
    const offerGenreTypes = buildOfferGenreTypes(
      GenreType.MUSIC,
      ['Rap / Hip Hop'],
      genreTypeMapping
    )

    const expectedResult = [{ key: GenreType.MUSIC, name: 'RAP-HIP HOP', value: 'Rap / Hip Hop' }]

    expect(offerGenreTypes).toEqual(expectedResult)
  })

  it('should return only known offerGenreTypes items', () => {
    const offerGenreTypes = buildOfferGenreTypes(
      GenreType.MOVIE,
      ['Gros navet', 'Action'],
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
    const offerGenreTypes = buildOfferGenreTypes(GenreType.MOVIE, ['Gros navet'], genreTypeMapping)

    expect(offerGenreTypes).toEqual(undefined)
  })
})
