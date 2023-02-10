import { GenreType } from 'api/gen'
import { OfferGenreType } from 'features/search/types'
import { buildOfferGenreTypesValues } from 'libs/search/utils/buildOfferGenreTypesValues'

describe('buildOfferGenreTypesValues', () => {
  it('should return a list of OfferGenreTypes', () => {
    const bookTypes = [{ key: GenreType.BOOK, name: 'Informatique', value: 'Informatique' }]
    const movieGenres: OfferGenreType[] = [
      { key: GenreType.MOVIE, name: 'BOLLYWOOD', value: 'Bollywood' },
    ]
    const musicTypes: OfferGenreType[] = [{ key: GenreType.MUSIC, name: 'Gospel', value: 'Gospel' }]
    const showTypes: OfferGenreType[] = [{ key: GenreType.SHOW, name: 'Opéra', value: 'Opéra' }]

    const result = buildOfferGenreTypesValues({
      bookTypes,
      movieGenres: movieGenres,
      musicTypes: musicTypes,
      showTypes: showTypes,
    })

    expect(result).toEqual([
      { key: 'BOOK', name: 'Informatique', value: 'Informatique' },
      { key: 'MOVIE', name: 'BOLLYWOOD', value: 'Bollywood' },
      { key: 'MUSIC', name: 'Gospel', value: 'Gospel' },
      { key: 'SHOW', name: 'Opéra', value: 'Opéra' },
    ])
  })
  it('should return a list of OfferGenreTypes event if one field is undefined', () => {
    const movieGenres: OfferGenreType[] | undefined = undefined
    const musicTypes: OfferGenreType[] = [{ key: GenreType.MUSIC, name: 'Gospel', value: 'Gospel' }]

    const result = buildOfferGenreTypesValues({
      bookTypes: undefined,
      movieGenres: movieGenres,
      musicTypes: musicTypes,
      showTypes: undefined,
    })

    expect(result).toEqual([{ key: 'MUSIC', name: 'Gospel', value: 'Gospel' }])
  })
})
