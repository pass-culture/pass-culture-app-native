import { buildOfferGenreTypesValues } from 'libs/algolia/fetchAlgolia/fetchMultipleOffers/helpers/buildOfferGenreTypesValues'
import { GenreTypeMapping } from 'libs/subcategories/types'

const mockGenreTypeMapping: GenreTypeMapping = {
  BOOK: [{ name: 'Informatique', value: 'Informatique' }],
  MOVIE: [{ name: 'BOLLYWOOD', value: 'Bollywood' }],
  MUSIC: [{ name: 'Gospel', value: 'Gospel' }],
  SHOW: [{ name: 'Opéra', value: 'Opéra' }],
}

describe('buildOfferGenreTypesValues', () => {
  it('should return a list of OfferGenreTypes', () => {
    const result = buildOfferGenreTypesValues(
      {
        bookTypes: ['Informatique'],
        movieGenres: ['BOLLYWOOD'],
        musicTypes: ['Gospel'],
        showTypes: ['Opéra'],
      },
      mockGenreTypeMapping
    )

    expect(result).toEqual([
      { key: 'BOOK', name: 'Informatique', value: 'Informatique' },
      { key: 'MOVIE', name: 'BOLLYWOOD', value: 'Bollywood' },
      { key: 'MUSIC', name: 'Gospel', value: 'Gospel' },
      { key: 'SHOW', name: 'Opéra', value: 'Opéra' },
    ])
  })
  it('should return a list of OfferGenreTypes event if one field is undefined', () => {
    const result = buildOfferGenreTypesValues(
      {
        bookTypes: undefined,
        movieGenres: undefined,
        musicTypes: ['Gospel'],
        showTypes: undefined,
      },
      mockGenreTypeMapping
    )

    expect(result).toEqual([{ key: 'MUSIC', name: 'Gospel', value: 'Gospel' }])
  })
})
