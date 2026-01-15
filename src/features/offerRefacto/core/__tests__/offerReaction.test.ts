import { formatLikesCounter, getRecommendationText } from 'features/offerRefacto/core'

describe('formatLikesCounter', () => {
  it('should display exact number when likes counter < 1_000', () => {
    expect(formatLikesCounter(999)).toEqual('999 j’aime')
  })

  it('should display in thousands with decimals when likes counter > 1_000 and < 9_999', () => {
    expect(formatLikesCounter(1_000)).toEqual('1k j’aime')
    expect(formatLikesCounter(2_500)).toEqual('2,5k j’aime')
    expect(formatLikesCounter(1_549)).toEqual('1,5k j’aime')
    expect(formatLikesCounter(1_560)).toEqual('1,5k j’aime')
  })

  it('should display in thousands without decimals when likes counter > 10_000 and < 99_999', () => {
    expect(formatLikesCounter(10_000)).toEqual('10k j’aime')
    expect(formatLikesCounter(10_600)).toEqual('10k j’aime')
    expect(formatLikesCounter(99_999)).toEqual('99k j’aime')
  })

  it('should display in thousands without decimals when likes counter > 100_000 and < 999_999', () => {
    expect(formatLikesCounter(100_000)).toEqual('100k j’aime')
    expect(formatLikesCounter(100_600)).toEqual('100k j’aime')
  })

  it('should display in millions with decimals when likes counter > 1_000_000 and < 9_999_999', () => {
    expect(formatLikesCounter(1_000_000)).toEqual('1M j’aime')
    expect(formatLikesCounter(1_500_000)).toEqual('1,5M j’aime')
    expect(formatLikesCounter(1_550_000)).toEqual('1,5M j’aime')
    expect(formatLikesCounter(9_999_999)).toEqual('9,9M j’aime')
  })

  it('should display in millions without decimals when likes counter > 10_000_000', () => {
    expect(formatLikesCounter(25_000_000)).toEqual('25M j’aime')
    expect(formatLikesCounter(25_499_999)).toEqual('25M j’aime')
    expect(formatLikesCounter(25_501_000)).toEqual('25M j’aime')
  })
})

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

  it('should return an empty string when headlineOffersCount is 0', () => {
    expect(getRecommendationText(0)).toEqual('')
  })

  it('should handle large numbers correctly', () => {
    expect(getRecommendationText(1000)).toEqual('Recommandé par 1000 lieux culturels')
  })
})
