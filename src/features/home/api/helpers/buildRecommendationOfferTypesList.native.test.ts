import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'

describe('buildOfferTypesList', () => {
  it('should return an empty offerTypeList', () => {
    const bookTypes = undefined
    const movieGenres = undefined
    const musicTypes = undefined
    const showTypes = undefined

    const offerTypeList = buildRecommendationOfferTypesList({
      bookTypes,
      movieGenres,
      musicTypes,
      showTypes,
    })

    const expectedOffertTypeList: typeof offerTypeList = []
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
  it('should return a formatted offerTypeList', () => {
    const bookTypes = ['art', 'cuisine']
    const movieGenres = ['ACTION', 'ART']
    const musicTypes = ['pop', 'Gospel']
    const showTypes = ['Danse', 'Cirque']

    const offerTypeList = buildRecommendationOfferTypesList({
      bookTypes,
      movieGenres,
      musicTypes,
      showTypes,
    })

    const expectedOffertTypeList = [
      { key: 'BOOK', value: 'art' },
      { key: 'BOOK', value: 'cuisine' },
      { key: 'MOVIE', value: 'ACTION' },
      { key: 'MOVIE', value: 'ART' },
      { key: 'MUSIC', value: 'pop' },
      { key: 'MUSIC', value: 'Gospel' },
      { key: 'SHOW', value: 'Danse' },
      { key: 'SHOW', value: 'Cirque' },
    ]
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
})
