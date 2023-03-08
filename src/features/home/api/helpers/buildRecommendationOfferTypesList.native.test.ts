import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'

describe('buildOfferTypesList', () => {
  it('should return an empty offerTypeList', () => {
    const bookTypes = undefined
    const movieGenres = undefined
    const musicTypes = undefined

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes, movieGenres, musicTypes })

    const expectedOffertTypeList: typeof offerTypeList = []
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
  it('should return a formatted offerTypeList', () => {
    const bookTypes = ['art', 'cuisine']
    const movieGenres = ['ACTION', 'ART']
    const musicTypes = ['pop', 'Gospel']

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes, movieGenres, musicTypes })

    const expectedOffertTypeList = [
      { key: 'BOOK', value: 'art' },
      { key: 'BOOK', value: 'cuisine' },
      { key: 'MOVIE', value: 'ACTION' },
      { key: 'MOVIE', value: 'ART' },
      { key: 'MUSIC', value: 'pop' },
      { key: 'MUSIC', value: 'Gospel' },
    ]
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
})
