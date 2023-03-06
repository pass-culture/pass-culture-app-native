import { buildRecommendationOfferTypesList } from 'features/home/api/helpers/buildRecommendationOfferTypesList'

describe('buildOfferTypesList', () => {
  it('should return an empty offerTypeList', () => {
    const bookTypes = undefined

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes })

    const expectedOffertTypeList: typeof offerTypeList = []
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
  it('should return a formatted offerTypeList', () => {
    const bookTypes = ['art', 'cuisine']

    const offerTypeList = buildRecommendationOfferTypesList({ bookTypes })

    const expectedOffertTypeList = [
      { key: 'BOOK', value: 'art' },
      { key: 'BOOK', value: 'cuisine' },
    ]
    expect(offerTypeList).toEqual(expectedOffertTypeList)
  })
})
