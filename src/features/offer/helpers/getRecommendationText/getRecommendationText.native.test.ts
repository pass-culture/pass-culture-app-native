import { getRecommendationText } from 'features/offer/helpers/getRecommendationText/getRecommendationText'

describe('getRecommendationText', () => {
  it("should return 'Recommandé par 1 lieu culturel' when headlineOffersCount is 1", () => {
    expect(getRecommendationText(1)).toEqual('Recommandé par 1 lieu culturel')
  })

  it("should return 'Recommandé par 2 lieux culturels' when headlineOffersCount is 2", () => {
    expect(getRecommendationText(2)).toEqual('Recommandé par 2 lieux culturels')
  })

  it("should return 'Recommandé par 10 lieux culturels' when headlineOffersCount is 10", () => {
    expect(getRecommendationText(10)).toEqual('Recommandé par 10 lieux culturels')
  })

  it("should return 'Recommandé par 0 lieu culturel' when headlineOffersCount is 0", () => {
    expect(getRecommendationText(0)).toEqual('Recommandé par 0 lieu culturel')
  })

  it('should handle large numbers correctly', () => {
    expect(getRecommendationText(1000)).toEqual('Recommandé par 1000 lieux culturels')
  })
})
