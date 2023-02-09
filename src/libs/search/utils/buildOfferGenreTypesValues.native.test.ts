import { GenreType } from 'api/gen'
import { OfferGenreType } from 'features/search/types'
import { buildOfferGenreTypesValues } from 'libs/search/utils/buildOfferGenreTypesValues'

describe('buildOfferGenreTypesValues', () => {
  it('should return a list of OfferGenreTypes', () => {
    const movieGenres: OfferGenreType[] = [
      { key: GenreType.MOVIE, name: 'BOLLYWOOD', value: 'Bollywood' },
    ]
    const musicTypes: OfferGenreType[] = [{ key: GenreType.MUSIC, name: 'Gospel', value: 'Gospel' }]

    const result = buildOfferGenreTypesValues({ movieGenres: movieGenres, musicTypes: musicTypes })

    expect(result).toEqual([
      { key: 'MOVIE', name: 'BOLLYWOOD', value: 'Bollywood' },
      { key: 'MUSIC', name: 'Gospel', value: 'Gospel' },
    ])
  })
  it('should return a list of OfferGenreTypes event if one field is undefined', () => {
    const movieGenres: OfferGenreType[] | undefined = undefined
    const musicTypes: OfferGenreType[] = [{ key: GenreType.MUSIC, name: 'Gospel', value: 'Gospel' }]

    const result = buildOfferGenreTypesValues({ movieGenres: movieGenres, musicTypes: musicTypes })

    expect(result).toEqual([{ key: 'MUSIC', name: 'Gospel', value: 'Gospel' }])
  })
})
