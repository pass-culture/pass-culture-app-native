import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'

describe('buildOfferTypesList', () => {
  it('should return an empty offerTypeList', () => {
    const bookTypes = undefined
    const movieGenres = undefined

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes, movieGenres })

    const expectedOffertTypeList: typeof offerTypeList = []
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
  it('should return a formatted offerTypeList', () => {
    const bookTypes = ['art', 'cuisine']
    const movieGenres = ['ACTION', 'ART']

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes, movieGenres })

    const expectedOffertTypeList = [
      { key: 'BOOK', value: 'art' },
      { key: 'BOOK', value: 'cuisine' },
      { key: 'MOVIE', value: 'ACTION' },
      { key: 'MOVIE', value: 'ART' },
    ]
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
})
